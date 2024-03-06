// config.js
const config = {
    development: {
      mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/model_data'
    },
    production: {
      mongodbUri: process.env.MONGODB_URI
    }
  };
  
  const environment = process.env.NODE_ENV || 'development';
  export default config[environment];
  