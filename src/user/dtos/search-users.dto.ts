import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchUsersDto {
  @ApiProperty({
    description: 'First name to search for',
    required: false,
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name to search for',
    required: false,
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Age to search for',
    required: false,
    example: 25,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age?: number;
}
