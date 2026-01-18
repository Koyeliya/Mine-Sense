
import { pgTable, text, serial, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  features: jsonb("features").notNull(), // Array of 60 numbers
  result: text("result").notNull(), // "Rock" or "Mine"
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({ 
  id: true, 
  createdAt: true 
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type PredictionResponse = Prediction;
