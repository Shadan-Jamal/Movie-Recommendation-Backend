import express,{Request, Response} from "express"
import { EmotionClassifier } from "../services/EmotionClassifer.ts"
import { feature_extraction_pipeline } from "../server.ts"
import { pinecone_service } from "../server.ts"


const router = express.Router()
const text_classification_pipeline = new EmotionClassifier()
//Fetching and sending movies based on emotions
router.post("/",async (req : Request, res : Response) => {
    try{
        const { plot } = req.body
        const options = { topk : 10 }

        //getting the emotion label
        const emotion = await text_classification_pipeline.detectEmotion(plot, options)

        //embedding the emotion into vectors
        const emotion_embedding = await feature_extraction_pipeline.getEmbedding(plot,{
            pooling : "mean",
            normalize : true
        })
        
        let results : any = await pinecone_service.queryBasedOnEmotions(
            emotion,
            Array.from(emotion_embedding.data)
        )
        
        results = results.map((res : any) => res.fields)
        res.json(results)
    }
    catch(err){

    }
})

export default router;