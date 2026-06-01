import express from "express";
import cors from "cors";
import { router } from "./routes";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/api", router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Rota não encontrada" });
});
