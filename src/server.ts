import express,{Request, Response} from "express";
import config from "./config/config";
import cors from "cors"
import { pipeline } from "@xenova/transformers"
const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173"
}))

const classification_pipeline = async () => {
    const classifier = await pipeline("text-classification","MicahB/roberta-base-go_emotions")
    return classifier
}


app.post("/",async (req : Request, res : Response) => {
    try{
        const {input} = req.body
        console.log(input)
        const classifier = await classification_pipeline()
        const result = await classifier(input)
        res.json(result)
    }
    catch(err){
        console.error(err)
    }
})


app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})