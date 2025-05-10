import mongoose from "mongoose";
import config from "../configs";
import logger from "./logger";

const connect = async () => {
  const MONGODB_URL = config.DB_CONNECTION_STRING;

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL);
    logger.info("Database Synced");
  } catch (err) {
    logger.error(`? ${err.message}`);
  }
};

export { connect };
