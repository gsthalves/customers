export type SearchCustomersUseCaseInput = {
  query: string;
};

export type SearchCustomersUseCaseOutput = {
  id: string;
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  notes?: string;
};

export abstract class ISearchCustomersUseCase {
  abstract execute(
    input: SearchCustomersUseCaseInput,
  ): Promise<SearchCustomersUseCaseOutput[] | []>;
}
