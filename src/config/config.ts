import dotenv from "dotenv"

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
  }
  
const frontendUrl = process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL_PROD;
console.log(process.env.PORT)
  const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl
  };
  
  console.log("Configuration Loaded:", config);
export default config;