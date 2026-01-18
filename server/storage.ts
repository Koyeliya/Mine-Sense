
import { predictions, type Prediction, type InsertPrediction } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictions(): Promise<Prediction[]>;
}

export class DatabaseStorage implements IStorage {
  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getPredictions(): Promise<Prediction[]> {
    return await db
      .select()
      .from(predictions)
      .orderBy(desc(predictions.createdAt))
      .limit(50);
  }
}

export const storage = new DatabaseStorage();
