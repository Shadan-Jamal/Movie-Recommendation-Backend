import express,{Request, Response} from "express";
import config from "./config/config.ts";
import cors from "cors"
import { RecordMetadata } from "@pinecone-database/pinecone";
import { DescriptionClassifier } from "./services/DescriptionClassifier.ts";
import { EmotionClassifier } from "./services/EmotionClassifer.ts";
import { PineconeService } from "./services/PineconeService.ts";

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173"
}))

const feature_extraction_pipeline = new DescriptionClassifier()
const text_classification_pipeline = new EmotionClassifier()
const pinecone_service = new PineconeService()

//Fetching and sending movies based on plot similarity
app.post("/description", async (req : Request, res : Response) =>{
    try {
        const { plot } = req.body;
        const options = {pooling : "mean", normalize : true}

        const output = await feature_extraction_pipeline.getEmbedding(plot, options);
        const vectors = Array.from(output.data)

        const results = await pinecone_service.queryResults({
            vector : vectors,
            topK : 20,
            includeMetadata : true
        })

        const recommendations = results.matches.map((match) => {
            const metadata : RecordMetadata | undefined = match.metadata
            return {
                id : metadata?.id,
                title : metadata?.title,
                genres : metadata?.genres,
                release_date : metadata?.release_date,
                runtime : metadata?.runtime,
                poster_path : metadata?.poster_path,
                score : match.score
            }
        })
        
        res.json(recommendations)
    }
    catch(err){
        console.log(err)
    }
})

//Fetching and sending movies based on emotions
app.post("/emotion",async (req : Request, res : Response) => {
    try{
        const { plot } = req.body
        const options = { topk : 10 }

        //getting the emotion label
        const emotion = await text_classification_pipeline.detectEmotion(plot, options)
        console.log(emotion)
        //embedding the emotion into vectors
        const emotion_embedding = await feature_extraction_pipeline.getEmbedding(plot,{
            pooling : "mean",
            normalize : true
        })
        console.log(emotion_embedding)
        const results = await pinecone_service.queryBasedOnEmotions(
            emotion,
            Array.from(emotion_embedding.data)
        )
        console.log(results)
    }
    catch(err){

    }
})

app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})