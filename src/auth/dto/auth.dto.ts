import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AuthenticationDto {

    @ApiProperty({ 
      required: true,
      example: "user@email.com"
    })
    @IsEmail()
    readonly email: string;
  
    @ApiProperty({ 
      required: true, 
      example: "123456"
    })
    @IsString()
    readonly password: string;
  }