import dotenv from 'dotenv'
dotenv.config()
const config = {
    development: {
      mongodbUri: process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/model_data'
    },
    production: {
      mongodbUri: process.env.MONGODB_URI
    }
  };
  
  const environment = process.env.NODE_ENV || 'development';
  export default config[environment];
  