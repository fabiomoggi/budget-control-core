import type { SaveUserProfileDTO } from "../../dtos/SaveUserProfileDTO.js";

export interface UserProfileRepositoryPort {
  saveUserProfile(profile: SaveUserProfileDTO): Promise<void>;
}
