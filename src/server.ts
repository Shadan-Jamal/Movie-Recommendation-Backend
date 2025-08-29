import express, {Request, Response} from "express";
import descriptionRouter from "@routes/description";
import emotionRouter from "@routes/emotion"
import config from "@config/config"
import cors from "cors"
import { EmotionClassifier } from "@services/EmotionClassifier";
import { PineconeService } from "@services/PineconeService";

const app = express()

//middleware
app.use(express.json())
app.use(cors({
    origin : "*"
}))

export const text_classification_pipeline = new EmotionClassifier()
export const pinecone_service = new PineconeService()

app.get("/", (req : Request, res : Response) => {
    console.log("Hi world")
    res.send("Hello, World!")
})
app.use("/description", descriptionRouter);
app.use("/emotion", emotionRouter)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
})