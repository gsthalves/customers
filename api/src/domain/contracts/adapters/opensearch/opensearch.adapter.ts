export type IndexOpenSearchInput = {
  index: string;
  id: string;
  document: any;
};

export type SearchOpenSearchInput = {
  index: string;
  body: any;
};

export type DeleteOpenSearchInput = {
  index: string;
  id: string;
};

export abstract class IOpenSearch {
  abstract index(input: IndexOpenSearchInput): Promise<void>;
  abstract search<T>(input: SearchOpenSearchInput): Promise<T[] | null>;
  abstract delete(input: DeleteOpenSearchInput): Promise<void>;
}
