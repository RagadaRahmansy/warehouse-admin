import { IsEmail, IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['ADMIN', 'WAREHOUSE_MANAGER', 'STAFF'])
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'STAFF';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'WAREHOUSE_MANAGER', 'STAFF'])
  role?: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'STAFF';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
