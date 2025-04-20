import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'User age',
    example: 25,
  })
  age: number;

  password: string;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2025-04-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2025-04-20T10:00:00Z',
  })
  updatedAt: Date;
}
