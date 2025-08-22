import express from "express"
import { Request, Response } from "express";
import { RecordMetadata } from "@pinecone-database/pinecone";
import { feature_extraction_pipeline } from "../server.ts";
import { pinecone_service } from "../server.ts";

const router = express.Router()

//Fetching and sending movies based on plot similarity
router.post("/", async (req : Request, res : Response) =>{
    try {
        const { plot } = req.body;
        const options = {pooling : "mean", normalize : true}

        const output = await feature_extraction_pipeline.getEmbedding(plot, options);
        const vectors = Array.from(output.data)

        const results = await pinecone_service.queryResults({
            vector : vectors,
            topK : 40,
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
                imdbId : metadata?.imdbId,
                score : match.score,
            }
        })
        
        res.json(recommendations)
    }
    catch(err){
        console.log(err)
    }
})

export default router;