export type UpdateCustomerUseCaseInput = {
  id: string;
  name: string;
  birthDate: Date;
  phone: string;
  notes?: string;
};

export type UpdateCustomerUseCaseOutput = {
  id: string;
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  notes?: string;
};

export abstract class IUpdateCustomerUseCase {
  abstract execute(
    input: UpdateCustomerUseCaseInput,
  ): Promise<UpdateCustomerUseCaseOutput>;
}
