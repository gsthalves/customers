import crypto from 'node:crypto';

export type BaseEntityProps = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class BaseEntity<T extends BaseEntityProps> {
  constructor(protected readonly props: T) {
    this.validate();
  }

  get id(): string {
    this.props.id = this.props.id ?? crypto.randomUUID();

    return this.props.id;
  }

  get createdAt(): Date {
    this.props.createdAt = this.props.createdAt ?? new Date();

    return this.props.createdAt;
  }

  get updatedAt(): Date {
    this.props.updatedAt = this.props.updatedAt ?? new Date();

    return this.props.updatedAt;
  }

  abstract validate(): void;
}
