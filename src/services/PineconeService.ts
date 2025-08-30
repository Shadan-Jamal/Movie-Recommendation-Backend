import { EmbeddingsList } from "@pinecone-database/pinecone"
import {index, pinecone, parameters, model} from "../config/pinecone_setup.js"

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
    fear: ["Horror", "Thriller", "War"],
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
        try {
            console.log('[PineconeService] Querying with options:', JSON.stringify(queryOptions));
            const results = await index.query(queryOptions);
            console.log('[PineconeService] Query successful');
            return results;
        } catch (error) {
            console.error('[PineconeService] Error in queryResults:', error);
            throw error;
        }
    }

    async generateEmbeddings(text : string | string[]) : Promise<number[]>{
        try {
            const input = Array.isArray(text) ? text : [text];
            console.log('[PineconeService] Generating embeddings for input:', input);
            const embeddings : EmbeddingsList = await pinecone.inference.embed(model, input, parameters);
            console.log('[PineconeService] Embeddings generated successfully');
            const data : any = embeddings.data;
            if (!data || !data[0] || !data[0].values) {
                throw new Error('Invalid embedding response structure');
            }
            return data[0].values;
        } catch (error) {
            console.error('[PineconeService] Error in generateEmbeddings:', error);
            throw error;
        }
    }

    async queryBasedOnEmotions(emotion : string, emotion_embedding : number[]){
        let targetGenres = genres[emotion]
        console.log(targetGenres)
        // Fetch all movies that match any genre in targetGenres
        try{
            const movies = await index.namespace("__default__").searchRecords({
                query : {
                    vector : {
                        values : emotion_embedding
                    },
                    topK : 40,
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
            
            return movies.result.hits
        }
        catch(err){
            console.log(err)
        }
    }
}