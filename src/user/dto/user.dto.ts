import { IsString, IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  username;

  @IsNotEmpty()
  @IsString()
  password;
}
