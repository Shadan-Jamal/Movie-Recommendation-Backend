import express,{Request, Response} from "express"
import { pinecone_service } from "../server.js"
import { fetchMovie } from "../utils/fetchMovieDetails.js"
import { index } from "../config/pinecone_setup.js"

const router = express.Router()

router.post("/",async (req : Request, res : Response) => {
    try {
        const { imdbId } = req.body
        //Checking if movie exists
        const exists = await pinecone_service.checkIfMovieExists(imdbId)
        console.log(exists)
        if(exists){
            return res.status(409).send("Movie already exists")
        }
        
        // Fetch movie details
        const movie_details = await fetchMovie(imdbId)
        if(typeof movie_details === "string"){
            //if the ID provided is not a valid imdb ID for a movie
            return res.status(404).send(movie_details)
        }
        //embedding the movie plot
        const embeddings = await pinecone_service.generateEmbeddings(movie_details.plot)
        console.log(movie_details)
        await index.upsert([{
            id : imdbId,
            values : embeddings,
            metadata : {
                ...movie_details
            }
        }])
        res.status(201).json("Movie Details Created")
    } catch (error) {
        console.error("❌ Error in movie route:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
})

export default router;