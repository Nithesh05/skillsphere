import dns from 'dns';
import mongoose from 'mongoose';

// Hotspot/ISP DNS often refuses SRV lookups required by mongodb+srv:// URIs
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retriesLeft = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Retry on transient Atlas/network failures before exiting
    if (retriesLeft > 0) {
      console.warn(
        `MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retriesLeft} left)`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retriesLeft - 1);
    }

    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
