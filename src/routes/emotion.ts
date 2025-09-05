import express from "express"
import {Request, Response} from "express"
import { pinecone_service } from "../server.js"
import { text_classification_pipeline } from "../server.js"
import {rateLimit} from "express-rate-limit"

const router = express.Router()

const limiter = rateLimit({
    windowMs : 15 * 1000,
    limit : 5,
    standardHeaders : true,
    ipv6Subnet : 56
})

router.use(limiter)

//Fetching and sending movies based on emotions
router.post("/",async (req : Request, res : Response) => {
    try{
        const { plot } = req.body;
        if (!plot) {
            return res.status(400).json({ error: 'Plot is required' });
        }
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
        res.json(hits)
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;