import dotenv from "dotenv"

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    omdb_url: string;
    omdb_api_key: string;
  }
  
  const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    omdb_url: process.env.OMDB_URL,
    omdb_api_key: process.env.OMDB_API_KEY,
  };
  
  // Check if required environment variables are set
  if (!process.env.OMDB_API_KEY) {
    console.warn("⚠️  OMDB_API_KEY not found in environment variables!");
  }
  
export default config;