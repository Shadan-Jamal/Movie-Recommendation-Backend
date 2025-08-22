import {index} from "../config/pinecone_setup.ts"
import { Tensor } from "@xenova/transformers"

const  genres : {[key : string] : string[]} = {
    admiration: ["Drama", "Romance"],
    amusement: ["Comedy", "Family", "Animation","Romance"],
    anger: ["Thriller", "Crime", "Action", "Drama"],
    annoyance: ["Comedy", "Drama"],
    approval: ["Drama"],
    caring: ["Drama", "Family", "Romance"],
    confusion: ["Mystery", "Thriller", "Science Fiction"],
    curiosity: ["Mystery","Thriller", "Adventure", "Documentary"],
    desire: ["Romance", "Drama"],
    disappointment: ["Drama"],
    disapproval: ["Drama", "Crime"],
    disgust: ["Horror", "Thriller"],
    embarrassment: ["Comedy", "Romance"],
    excitement: ["Action", "Adventure", "Thriller"],
    fear: ["Horror", "Thriller"],
    gratitude: ["Drama", "Family"],
    grief: ["Drama"],
    joy: ["Comedy", "Family", "Adventure"],
    love: ["Romance", "Drama"],
    nervousness: ["Thriller", "Drama"],
    optimism: ["Family", "Adventure", "Comedy"],
    pride: ["Drama"],
    realization: ["Drama", "Mystery","Thriller"],
    relief: ["Comedy", "Drama"],
    remorse: ["Drama"],
    sadness: ["Drama", "Romance"],
    surprise: ["Mystery", "Thriller"],
    neutral: ["Drama"],
}

interface QueryResults{
    vector : any[],
    topK : number,
    includeMetadata : boolean
}

export class PineconeService{
    
    async queryResults(queryOptions : QueryResults){
        const results = await index.query(queryOptions)
        return results
    }

    async queryBasedOnEmotions(emotion : string, emotion_embedding : number[]){
        const targetGenres = genres[emotion] || []

        // Fetch all movies that match any genre in targetGenres
        try{
            const results = await index.namespace("__default__").searchRecords({
                query : {
                    vector : {
                        values : emotion_embedding
                    },
                    topK : 50,
                    filter : {
                        genres : {"$in" : targetGenres}
                    }
                },
                rerank : {
                    query : emotion,
                    model : "bge-reranker-v2-m3",
                    rankFields : ["title"]
                }
            })
            return results.result.hits
        }
        catch(err){
            console.log(err)
        }
    }
}