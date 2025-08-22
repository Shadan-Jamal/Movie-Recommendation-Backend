import express,{Request, Response} from "express";
import descriptionRouter from "./routes/description.ts";
import emotionRouter from "./routes/emotion.ts"
import config from "./config/config.ts";
import cors from "cors"
import { DescriptionClassifier } from "./services/DescriptionClassifier.ts";
import { EmotionClassifier } from "./services/EmotionClassifer.ts";
import { PineconeService } from "./services/PineconeService.ts";

const app = express()
export const feature_extraction_pipeline = new DescriptionClassifier()
export const text_classification_pipeline = new EmotionClassifier()
export const pinecone_service = new PineconeService()

//middleware
app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173"
}))

app.use("/description", descriptionRouter);
app.use("/emotion", emotionRouter)

app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})