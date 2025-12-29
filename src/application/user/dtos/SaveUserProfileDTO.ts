import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";

export interface SaveUserProfileDTO {
  id: EntityIdDTO;
  fullName: string;
  email: string;
}