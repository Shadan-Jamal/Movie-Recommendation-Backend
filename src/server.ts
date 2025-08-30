import express from "express";
import descriptionRouter from "./routes/description.js";
import emotionRouter from "./routes/emotion.js"
import config from "./config/config.js"
import cors from "cors"
import { EmotionClassifier } from "./services/EmotionClassifier.js";
import { PineconeService } from "./services/PineconeService.js";

const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin : [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL_PROD]
}))

export const text_classification_pipeline = new EmotionClassifier()
export const pinecone_service = new PineconeService()
try{
    app.use("/description", descriptionRouter);
    app.use("/emotion", emotionRouter)
}
catch(err){
    console.error(err)
}

app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})

export default app;