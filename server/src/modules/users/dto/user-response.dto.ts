import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  picture: string | null;

  @ApiProperty({
    example: '2026-11-05T04:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-11-05T04:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
