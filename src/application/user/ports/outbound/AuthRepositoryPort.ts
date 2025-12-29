import type { SaveUserProfileDTO } from "../../../user/dtos/SaveUserProfileDTO.js";

export interface AuthRepositoryPort {
  saveUserProfile(profile: SaveUserProfileDTO): Promise<void>;
}
