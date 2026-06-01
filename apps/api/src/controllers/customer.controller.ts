import type { Request, Response } from "express";
import { createCustomerSchema } from "@john-doe/shared";
import type { ApiResponse, CustomerResponse } from "@john-doe/shared";
import { CustomerService, ConflictError } from "../services/customer.service";
import { CustomerRepository } from "../repositories/customer.repository";
import { ZodError } from "zod";

// Controller: só faz parsing HTTP, delega pro service e responde.
// Não tem regra de negócio aqui.

const repository = new CustomerRepository();
const service = new CustomerService(repository);

export async function createCustomer(
  req: Request,
  res: Response<ApiResponse<CustomerResponse>>
): Promise<void> {
  try {
    const dto = createCustomerSchema.parse(req.body);
    const result = await service.registerCustomer(dto);

    res.status(201).json({
      success: true,
      data: result.customer,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const details: Record<string, string[]> = {};
      error.errors.forEach((e) => {
        const key = e.path.join(".");
        if (!details[key]) details[key] = [];
        details[key].push(e.message);
      });

      res.status(422).json({
        success: false,
        error: "Dados inválidos",
        details,
      });
      return;
    }

    if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: error.message,
      });
      return;
    }

    console.error("Unexpected error:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno. Tente novamente mais tarde.",
    });
  }
}
