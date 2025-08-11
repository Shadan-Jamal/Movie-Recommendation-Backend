import express,{Request, Response} from "express";
import config from "./config/config.ts";
import cors from "cors"
import { pipeline, Tensor } from "@xenova/transformers"
import { index } from "./config/pinecone_setup.ts";
import { RecordMetadata, RecordValues } from "@pinecone-database/pinecone";

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173"
}))

const text_classification_pipeline = async () => {
    const classifier = await pipeline("text-classification","MicahB/roberta-base-go_emotions")
    return classifier
}

const feature_extraction_pipeline = async () => {
    const classifier = await pipeline("feature-extraction","Xenova/all-MiniLM-L6-v2")
    return classifier
}

app.post("/",async (req : Request, res : Response) => {
    try{
        const {input} = req.body
        console.log(input)
        const classifier = await text_classification_pipeline()
        const result = await classifier(input)
        res.json(result)
    }
    catch(err){
        console.error(err)
    }
})

app.post("/description", async (req : Request, res : Response) =>{
    try {
        const { plot } = req.body;
        const embedder = await feature_extraction_pipeline()
        const output : Tensor = await embedder(plot, {pooling : "mean", normalize : true});
        const vectors = Array.from(output.data)
        console.log(vectors)

        const results = await index.query({
            vector : vectors,
            topK : 15,
            includeMetadata : true
        })

        // console.log(results)

        const recommendations = results.matches.map((match) => {
            const metadata : RecordMetadata | undefined = match.metadata 
            return {
                title : metadata?.title,
                genre : metadata?.genre,
                score : match.score
            }
        })
        console.log("Sending back data")
        res.json(recommendations)
    }
    catch(err){
        console.log(err)
    }
})


app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})