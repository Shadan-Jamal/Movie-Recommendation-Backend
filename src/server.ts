import express, { NextFunction, Request, Response } from "express";
import descriptionRouter from "./routes/description.js";
import emotionRouter from "./routes/emotion.js"
import movieRouter from "./routes/movie.js"
import config from "./config/config.js"
import { EmotionClassifier } from "./services/EmotionClassifier.js";
import { PineconeService } from "./services/PineconeService.js";
import cors from "cors"

const app = express()

const logging = (req: Request, res: Response, next: NextFunction) => {
    console.log(`🔍 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`)
    next()
}

// middleware
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(logging)

export const text_classification_pipeline = new EmotionClassifier()
export const pinecone_service = new PineconeService()

app.use("/description", descriptionRouter);
app.use("/emotion", emotionRouter)
app.use("/movie",movieRouter)

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(config.port, '0.0.0.0', () => {
        console.log(`🚀 Server listening on port: ${config.port}`)
        console.log(`📱 Mobile access: http://192.168.1.8:${config.port}`)
    })
}

export default app;