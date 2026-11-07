import {
    IsArray,
    IsIn,
    IsOptional,
    IsString,
    IsUrl,
    ArrayNotEmpty,
    ArrayUnique,
    Matches,
    IsEnum,
} from 'class-validator';

import { McpScope } from '../../../../common/constants/prisma-enums.js';

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
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEnum(McpScope, { each: true })
    scope?: McpScope[];
}