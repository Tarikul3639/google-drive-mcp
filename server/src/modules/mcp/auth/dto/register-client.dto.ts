import {
    IsArray,
    IsIn,
    IsOptional,
    IsString,
    IsUrl,
    ArrayNotEmpty,
    ArrayUnique,
    Matches,
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
    @Matches(/^[\w\s.-]{1,100}$/)
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

    @IsOptional()
    @IsString()
    @Matches(/^(drive:read|drive:write)( drive:read| drive:write)*$/)
    scope?: string;
}
