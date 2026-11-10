import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  ArrayUnique,
  MaxLength,
  Allow,
} from 'class-validator';

export class RegisterClientDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUrl(
    {
      require_protocol: true,
      require_tld: false,
    },
    { each: true },
  )
  redirect_uris!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  client_name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(['authorization_code', 'refresh_token'], { each: true })
  grant_types?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(['code'], { each: true })
  response_types?: string[];

  @IsOptional()
  @IsIn(['none'])
  token_endpoint_auth_method?: string;

  // Ignore registration scope metadata; every approved MCP client receives
  // the same full Drivebridge access.
  @IsOptional()
  @Allow()
  scope?: unknown;

  @IsOptional()
  @IsIn(['web', 'native'])
  application_type?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  resource?: string;

  // Standard OAuth Dynamic Client Registration metadata that this server
  // does not need to persist, but should accept from interoperable clients.
  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  client_uri?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  logo_uri?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[];

  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  tos_uri?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  policy_uri?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: false })
  jwks_uri?: string;

  @IsOptional()
  @Allow()
  jwks?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  software_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  software_version?: string;
}
