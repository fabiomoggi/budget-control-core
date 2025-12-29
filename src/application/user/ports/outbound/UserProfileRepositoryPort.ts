import type { SaveUserProfileDTO } from "../../dtos/SaveUserProfileDTO.js";

export interface AuthRepositoryPort {
  saveUserProfile(profile: SaveUserProfileDTO): Promise<void>;
}
