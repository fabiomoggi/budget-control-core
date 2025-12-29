import type { RegisterUserInputDTO } from "../../../user/dtos/RegisterUserDTO.js";
import type { EntityIdDTO } from "../../../common/dtos/EntityIdDTO.js";

export interface AuthServicePort {
  registerUser(input: RegisterUserInputDTO): Promise<{ userId: EntityIdDTO }>;
}
