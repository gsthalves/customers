import { BaseEntity, BaseEntityProps } from 'domain/entities';
import { CustomerStatus } from 'domain/enums';
import { BusinessValidationError } from 'domain/errors';

export type CustomerEntityProps = {
  pk?: string;
  sk?: string;
  name: string;
  taxId: string;
  birthDate: Date;
  email: string;
  phone: string;
  status?: CustomerStatus;
  notes?: string;
} & BaseEntityProps;

export class CustomerEntity extends BaseEntity<CustomerEntityProps> {
  constructor(props: CustomerEntityProps) {
    super(props);
  }

  get pk(): string {
    return 'CUSTOMER#' + this.id;
  }

  get sk(): string {
    return 'CUSTOMER#TAXID#' + this.taxId;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    if (!value || !value.trim())
      throw new BusinessValidationError('Name is required.');

    this.props.name = value;
  }

  get taxId(): string {
    return this.props.taxId;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  set birthDate(value: Date) {
    if (!value) throw new BusinessValidationError('BirthDate is required.');

    this.props.birthDate = value;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  set phone(value: string) {
    if (!value || !value.trim())
      throw new BusinessValidationError('Phone is required.');

    if (!this.isValidPhone(value))
      throw new BusinessValidationError('Phone is invalid');

    this.props.phone = value;
  }

  get status(): CustomerStatus {
    return this.props.status ?? CustomerStatus.ACTIVE;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  set notes(value: string | undefined) {
    this.props.notes = value;
  }

  private isValidTaxId(taxId: string): boolean {
    taxId = taxId.replace(/[^\d]/g, '');

    if (taxId.length !== 11 || /^(\d)\1{10}$/.test(taxId)) {
      return false;
    }

    const calculateCheckDigit = (factor: number) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(taxId[i]) * (factor - i);
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstCheckDigit = calculateCheckDigit(10);
    const secondCheckDigit = calculateCheckDigit(11);

    return (
      firstCheckDigit === parseInt(taxId[9]) &&
      secondCheckDigit === parseInt(taxId[10])
    );
  }

  private isValidEmail(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  private isValidPhone(phone: string): boolean {
    return /^[0-9]{10,11}$/.test(phone);
  }

  public validate(): void {
    if (!this.name || !this.name.trim())
      throw new BusinessValidationError('Name is required.');

    if (!this.taxId || !this.taxId.trim())
      throw new BusinessValidationError('TaxId is required.');

    if (!this.isValidTaxId(this.taxId))
      throw new BusinessValidationError('TaxId is invalid.');

    if (!this.birthDate)
      throw new BusinessValidationError('BirthDate is required.');

    if (!this.email || !this.email.trim())
      throw new BusinessValidationError('Email is required.');

    if (!this.isValidEmail(this.email))
      throw new BusinessValidationError('Email is invalid.');

    if (!this.phone || !this.phone.trim())
      throw new BusinessValidationError('Phone is required.');

    if (!this.isValidPhone(this.phone))
      throw new BusinessValidationError('Phone is invalid');
  }
}
