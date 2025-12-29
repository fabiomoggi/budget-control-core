import type { AuthServicePort } from "../../user/ports/outbound/AuthServicePort.js";
import type { UserProfileRepositoryPort } from "../ports/outbound/UserProfileRepositoryPort.js";
import type {
  RegisterUserInputDTO,
  RegisterUserOutputDTO,
} from "../dtos/RegisterUserDTO.js";

export class RegisterUserUseCase {
  constructor(
    private readonly authService: AuthServicePort,
    private readonly userProfileRepository: UserProfileRepositoryPort
  ) { }

  async execute(input: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {
    const { userId } = await this.authService.registerUser(input);

    await this.userProfileRepository.saveUserProfile({
      id: userId,
      fullName: input.fullName,
      email: input.email,
    });

    return { userId };
  }
}
