import express from "express";
import cors from "cors";
import { router } from "./routes";

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? []),
];

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin denied: ${origin}`));
      }
    },
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/api", router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Rota não encontrada" });
});
