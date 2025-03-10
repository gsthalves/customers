import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCustomerInput {
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'John Doe', description: 'Name of customer.' })
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '21-09-1995', description: 'BirthDate of customer.' })
  birthDate: string;

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
