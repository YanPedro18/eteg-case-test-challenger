import { pool } from "../config/database";
import type { CreateCustomerDTO, CustomerResponse } from "@john-doe/shared";

// Repository Pattern: toda lógica de acesso ao banco fica aqui.
// Se trocar de banco no futuro, só muda essa camada.

export class CustomerRepository {
  async findByCpf(cpf: string): Promise<CustomerResponse | null> {
    const { rows } = await pool.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );
    return rows[0] ? this.mapToResponse(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<CustomerResponse | null> {
    const { rows } = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );
    return rows[0] ? this.mapToResponse(rows[0]) : null;
  }

  async create(data: CreateCustomerDTO): Promise<CustomerResponse> {
    const { rows } = await pool.query(
      `INSERT INTO customers (full_name, cpf, email, favorite_color, observations)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.fullName, data.cpf, data.email, data.favoriteColor, data.observations]
    );
    return this.mapToResponse(rows[0]);
  }

  // Mapeia snake_case do DB para camelCase do DTO
  private mapToResponse(row: Record<string, unknown>): CustomerResponse {
    return {
      id: row.id as string,
      fullName: row.full_name as string,
      cpf: row.cpf as string,
      email: row.email as string,
      favoriteColor: row.favorite_color as CustomerResponse["favoriteColor"],
      observations: row.observations as string,
      createdAt: (row.created_at as Date).toISOString(),
    };
  }
}
