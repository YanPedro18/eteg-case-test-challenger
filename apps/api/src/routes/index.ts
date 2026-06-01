import { Router } from "express";
import { createCustomer } from "../controllers/customer.controller";
import { rainbowColorLabels } from "@john-doe/shared";

export const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Retorna as cores disponíveis — o front consome isso dinamicamente
// Assim, se adicionar novas cores no shared, o front atualiza sozinho
router.get("/colors", (_req, res) => {
  const colors = Object.entries(rainbowColorLabels).map(([value, label]) => ({
    value,
    label,
  }));
  res.json({ success: true, data: colors });
});

// Cadastro de cliente
router.post("/customers", createCustomer);
