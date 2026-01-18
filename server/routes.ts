
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";
import fs from "fs";
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

  app.get('/api/samples/random', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'server', 'sonar_samples.txt');
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Samples file not found" });
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim() !== '');
      if (lines.length === 0) {
        return res.status(404).json({ message: "No samples available" });
      }

      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const parts = randomLine.split(',');
      const features = parts.slice(0, 60).map(Number);
      
      res.json({ features });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
