import express from "express"
import {Request, Response} from "express"
import { pinecone_service } from "../server"
import { text_classification_pipeline } from "../server"


const router = express.Router()
//Fetching and sending movies based on emotions
router.post("/",async (req : Request, res : Response) => {
    try{
        const { plot } = req.body;
        if (!plot) {
            return res.status(400).json({ error: 'Plot is required' });
        }
        console.log(plot)
        const options = { topk : 10 }

        //getting the emotion label
        let [emotion] = await text_classification_pipeline.detectEmotion(plot, options)
        //embedding the emotion into vectors
        const emotion_embedding = await pinecone_service.generateEmbeddings(emotion)
        let hits  : any = await pinecone_service.queryBasedOnEmotions(
            emotion,
            emotion_embedding
        )
        
        hits = hits.map((res : any) => {
            const imdbId = res._id
            return {
                id : imdbId,
                ...res.fields
            }
        })
        console.log(hits)
        res.json(hits)
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;