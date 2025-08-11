import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class CreateCredentialDto extends PickType(CreateUserDto, ['username', 'email', 'password']) {

}
