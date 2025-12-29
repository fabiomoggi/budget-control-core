import type { AuthServicePort } from "../../user/ports/outbound/AuthServicePort.js";
import type { AuthRepositoryPort } from "../../user/ports/outbound/AuthRepositoryPort.js";
import type {
  RegisterUserInputDTO,
  RegisterUserOutputDTO,
} from "../dtos/RegisterUserDTO.js";
import type { SaveUserProfileDTO } from "../dtos/SaveUserProfileDTO.js";

export class RegisterUserUseCase {
  constructor(
    private readonly authService: AuthServicePort,
    private readonly authRepository: AuthRepositoryPort
  ) {}

  async execute(input: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {
    const { userId } = await this.authService.registerUser(input);

    const profile: SaveUserProfileDTO = {
      id: userId,
      fullName: input.fullName,
      email: input.email,
    };

    await this.authRepository.saveUserProfile(profile);

    return { userId };
  }
}
