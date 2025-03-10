export type GetCustomerUseCaseInput = {
  id: string;
};

export type GetCustomerUseCaseOutput = {
  id: string;
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  notes?: string;
};

export abstract class IGetCustomerUseCase {
  abstract execute(
    input: GetCustomerUseCaseInput,
  ): Promise<GetCustomerUseCaseOutput>;
}
