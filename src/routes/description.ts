import express from "express"
import { Request, Response } from "express"
import { RecordMetadata } from "@pinecone-database/pinecone"
import { pinecone_service } from "../server.js"
import {rateLimit} from "express-rate-limit"

const router = express.Router()

const limiter = rateLimit({
    windowMs : 15 * 1000,
    limit : 5,
    standardHeaders : true,
    ipv6Subnet : 56
})

router.use(limiter)

router.post("/", async (req : Request, res : Response) => {
    try{
        let {plot} = req.body
        console.log(plot)
        plot = Array(1).fill(plot)
        const output = await pinecone_service.generateEmbeddings(plot)

        const results = await pinecone_service.queryResults({
            vector : output,
            topK : 100,
            includeMetadata : true
        })

        const recommendations = results.matches.map((match : any) => {
            const metadata : RecordMetadata | undefined = match.metadata
            return {
                id : match?.id,
                title : metadata?.title,
                movie_link : metadata?.movie_link,
                rating : metadata?.rating,
                mpa : metadata?.MPA,
                genres : metadata?.genres,
                year : metadata?.year,
                duration : metadata?.duration,
            }
        })
        res.json(recommendations)
    }
    catch(err){
        console.error(err)  
        res.status(500).json("Internal Server Error")
    }
})

export default router;