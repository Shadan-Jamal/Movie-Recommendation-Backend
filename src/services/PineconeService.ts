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
        console.log(targetGenres)
        console.log("Fetching the movies")
        const results = index.searchRecords({
            query: {
                topK : 10,
                filter: {
                    genre : {$in : targetGenres}
                }
            }
        })
        return results
    }
}