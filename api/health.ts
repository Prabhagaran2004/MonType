import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";

// CORS middleware
const corsMiddleware = cors({
  origin: ["https://your-project-name.vercel.app", "http://localhost:3000"],
  methods: ["GET", "OPTIONS"],
  credentials: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    service: "MonadType Backend",
  });
}
