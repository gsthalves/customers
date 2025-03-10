import { CustomerDynamoDBStreamUseCase } from 'application/use-cases';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { makeLogger, makeOpenSearch } from 'infrastructure/factories';
import { makeCustomerOpenSearchRepository } from 'infrastructure/factories';

const logger = makeLogger();

export const handler = async (event: DynamoDBStreamEvent) => {
  logger.info('CustomerDynamoDBStream.handler', 'Starting handler stream.');

  const records = event.Records;

  const openSearch = makeOpenSearch(logger);
  const customerOpenSearchRepository = makeCustomerOpenSearchRepository(
    logger,
    openSearch,
  );

  const useCase = new CustomerDynamoDBStreamUseCase(
    logger,
    customerOpenSearchRepository,
  );

  if (records && records.length > 0) {
    const record = records[0];
    const eventName = record.eventName;
    const keys = record.dynamodb?.Keys;
    const oldData = record.dynamodb?.OldImage;
    const newData = record.dynamodb?.NewImage;

    await useCase.execute({
      eventName: eventName,
      keys: keys,
      oldData: oldData,
      newData: newData,
    });
  }

  logger.info('CustomerDynamoDBStream.handler', 'Finished handler stream.');
};
