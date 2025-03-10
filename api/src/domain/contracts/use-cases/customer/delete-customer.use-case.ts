export type DeleteCustomerUseCaseInput = {
  id: string;
};

export abstract class IDeleteCustomerUseCase {
  abstract execute(input: DeleteCustomerUseCaseInput): Promise<void>;
}
