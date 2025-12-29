import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";

export interface RegisterUserInputDTO {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterUserOutputDTO {
  userId: EntityIdDTO;
}
