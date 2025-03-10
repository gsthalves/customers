export type CreateCustomerUseCaseInput = {
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  notes?: string;
};

export type CreateCustomerUseCaseOutput = {
  id: string;
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  notes?: string;
};

export abstract class ICreateCustomerUseCase {
  abstract execute(
    input: CreateCustomerUseCaseInput,
  ): Promise<CreateCustomerUseCaseOutput>;
}
