import {Pinecone} from "@pinecone-database/pinecone"
import dotenv from "dotenv"

dotenv.config()

const pinecone = new Pinecone({
  apiKey: `${process.env.PINECONE_ENV}`
});

const index = pinecone.index("movies-data")
const model = "llama-text-embed-v2"
const parameters : any = {
  inputType : "query",
  truncate : "END",
  dimension : 768
}
export { 
  pinecone, 
  index,
  model,
  parameters
};