import type { CreateCustomerDTO, CustomerResponse } from "@john-doe/shared";
import { CustomerRepository } from "../repositories/customer.repository";

// Service Layer: regras de negócio ficam aqui, não no controller.
// O controller só orquestra HTTP; o serviço sabe o "o que fazer".

export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async registerCustomer(
    data: CreateCustomerDTO
  ): Promise<{ customer: CustomerResponse }> {
    // Regra: CPF único — cliente só pode cadastrar uma vez
    const existingByCpf = await this.repository.findByCpf(data.cpf);
    if (existingByCpf) {
      throw new ConflictError("CPF já cadastrado. Cada cliente pode se cadastrar apenas uma vez.");
    }

    // Regra: e-mail único
    const existingByEmail = await this.repository.findByEmail(data.email);
    if (existingByEmail) {
      throw new ConflictError("E-mail já cadastrado.");
    }

    const customer = await this.repository.create(data);
    return { customer };
  }
}

// Erro de domínio — não vaza detalhes do banco pro controller
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
