
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.predict.submit.path, async (req, res) => {
    try {
      const { features } = api.predict.submit.input.parse(req.body);

      // Run python script
      const pythonProcess = spawn('python3', ['server/predict.py']);
      
      let dataString = '';
      let errorString = '';

      // Send data to python script
      pythonProcess.stdin.write(JSON.stringify({ features }));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          return res.status(500).json({ message: "Prediction failed", details: errorString });
        }

        try {
          const result = JSON.parse(dataString);
          
          if (result.error) {
            return res.status(500).json({ message: result.error });
          }

          // Save to DB
          const saved = await storage.createPrediction({
            features: features,
            result: result.result,
            confidence: result.confidence
          });

          res.json({
            result: saved.result,
            confidence: saved.confidence
          });
        } catch (e) {
          res.status(500).json({ message: "Failed to parse prediction result" });
        }
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.predict.history.path, async (req, res) => {
    const history = await storage.getPredictions();
    res.json(history);
  });

  return httpServer;
}
