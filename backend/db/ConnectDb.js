import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    const host = connect.connection.host;
    console.log(`Database Connected ${host}`);
  } catch (error) {
    console.error(`Error in connecting to db ${error.message}`);
  }
};
