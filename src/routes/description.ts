import express from "express"
import { Request, Response } from "express"
import { RecordMetadata } from "@pinecone-database/pinecone"
import { pinecone_service } from "@/server"

const router = express.Router()

router.post("/", async (req : Request, res : Response) => {
    try{
        let {plot} = req.body
        plot = Array(1).fill(plot)
        const output = await pinecone_service.generateEmbeddings(plot)

        const results = await pinecone_service.queryResults({
            vector : output,
            topK : 40,
            includeMetadata : true
        })

        const recommendations = results.matches.map((match) => {
            const metadata : RecordMetadata | undefined = match.metadata
            return {
                id : match?.id,
                title : metadata?.title,
                movie_link : metadata?.movie_link,
                rating : metadata?.rating,
                mpa : metadata?.mpa,
                genres : metadata?.genres,
                year : metadata?.year,
                duration : metadata?.duration,
            }
        })
        res.json(recommendations)
    }
    catch(err){
        res.status(500).json("Internal Server Error")
    }
})

export default router;