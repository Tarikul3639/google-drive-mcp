import { IsIn, IsString, IsNotEmpty } from 'class-validator';

export class ConsentRequestDto {
  @IsString()
  @IsNotEmpty()
  transaction!: string;

  @IsString()
  @IsIn(['allow', 'deny'])
  decision!: 'allow' | 'deny';
}
