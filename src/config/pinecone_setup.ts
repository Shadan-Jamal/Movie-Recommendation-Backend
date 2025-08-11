import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv"

dotenv.config()
// console.log(process.env)
// console.log(process.env.PINECONE_ENV)
const pinecone = new Pinecone({
  apiKey: `${process.env.PINECONE_ENV}`
});

const index = pinecone.index("movie-embeddings")

export { pinecone, index };