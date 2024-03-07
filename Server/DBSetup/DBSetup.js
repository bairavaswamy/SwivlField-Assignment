
import mongoose  from "mongoose";

const connectionDB = async () =>{
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected DataBase")
  }catch(error){
      console.log(`Error During Connection: ${error.message}`)
  }
}

export default connectionDB;