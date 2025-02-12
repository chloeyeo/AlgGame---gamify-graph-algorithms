const mongoose = require("mongoose");
const Score = require("../models/Score");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function reverseMigration() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Reverse the previous migration
    const result = await Score.updateMany({ totalMoves: { $exists: true } }, [
      {
        $set: {
          movesCount: "$totalMoves",
        },
      },
      {
        $unset: "totalMoves",
      },
    ]);

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log("Reverse migration completed successfully");
  } catch (error) {
    console.error("Reverse migration failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

reverseMigration();
