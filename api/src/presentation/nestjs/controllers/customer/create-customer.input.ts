import {
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerInput {
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'John Doe', description: 'Name of customer.' })
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(11)
  @MaxLength(14)
  @ApiProperty({ example: '42245682840', description: 'TaxId of customer.' })
  taxId: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '21-09-1995', description: 'BirthDate of customer.' })
  birthDate: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'gsthalves@gmail.com',
    description: 'Email of customer.',
  })
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(10)
  @MaxLength(11)
  @ApiProperty({
    example: '14997065872',
    description: 'Phone of customer.',
  })
  phone: string;

  @ApiProperty({
    example: 'Free text.',
    description: 'Notes about customer.',
    required: false,
  })
  notes: string;
}
