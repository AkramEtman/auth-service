import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  
  @ApiProperty({ 
    required: true,
    example: "user1"
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  
  @ApiProperty({ 
    required: true,
    example: "user@gmail.com"
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ 
    required: true,
    example: "123456"
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ 
    required: true,
    enum: Role,
    example: Role.Admin
  })
  @IsIn( Object.values( Role ) )
  @IsNotEmpty()
  readonly role: Role;

}