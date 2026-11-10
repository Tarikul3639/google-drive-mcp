import {
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class TokenRequestDto {
  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  resource?: string;

  @IsIn(['authorization_code', 'refresh_token'])
  grant_type!: 'authorization_code' | 'refresh_token';

  @IsString()
  @IsNotEmpty()
  client_id!: string;

  @ValidateIf((o: TokenRequestDto) => o.grant_type === 'authorization_code')
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ValidateIf((o: TokenRequestDto) => o.grant_type === 'authorization_code')
  @IsString()
  @IsNotEmpty()
  redirect_uri?: string;

  @ValidateIf((o: TokenRequestDto) => o.grant_type === 'authorization_code')
  @IsString()
  @Length(43, 128)
  @Matches(/^[A-Za-z0-9\-._~]+$/)
  code_verifier?: string;

  @ValidateIf((o: TokenRequestDto) => o.grant_type === 'refresh_token')
  @IsString()
  @IsNotEmpty()
  refresh_token?: string;
}
