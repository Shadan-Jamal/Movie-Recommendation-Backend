import express from "express";
import descriptionRouter from "./routes/description";
import emotionRouter from "./routes/emotion"
import config from "./config/config"
import cors from "cors"
import { EmotionClassifier } from "./services/EmotionClassifier";
import { PineconeService } from "./services/PineconeService";

const app = express()

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
// middleware
app.use(express.json())
app.use(cors({
    origin: config.frontendUrl
}))

export const text_classification_pipeline = new EmotionClassifier()
export const pinecone_service = new PineconeService()

app.use("/description", descriptionRouter);
app.use("/emotion", emotionRouter)

app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})