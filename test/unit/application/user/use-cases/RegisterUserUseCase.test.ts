// test/unit/application/user/use-cases/RegisterUserUseCase.test.ts
import { RegisterUserUseCase } from
  "../../../../../dist/application/user/use-cases/RegisterUserUseCase.js";

import type { AuthServicePort } from
  "../../../../../dist/application/user/ports/outbound/AuthServicePort.js";

import type { AuthRepositoryPort } from
  "../../../../../dist/application/user/ports/outbound/UserProfileRepositoryPort.js";

import type {
  RegisterUserInputDTO,
} from
  "../../../../../dist/application/user/dtos/RegisterUserDTO.js";

import type {
  SaveUserProfileDTO,
} from
  "../../../../../dist/application/user/dtos/SaveUserProfileDTO.js";

/* ------------------------------------------------------------------ */
/* In-memory fakes (NO mocks)                                          */
/* ------------------------------------------------------------------ */

class InMemoryAuthService implements AuthServicePort {
  public receivedInput?: RegisterUserInputDTO;
  public shouldFail = false;

  async registerUser(
    input: RegisterUserInputDTO
  ): Promise<{ userId: string }> {
    this.receivedInput = input;

    if (this.shouldFail) {
      throw new Error("AUTH_SERVICE_FAILED");
    }

    return { userId: "test-user-id" };
  }
}

class InMemoryAuthRepository implements AuthRepositoryPort {
  public savedProfile?: SaveUserProfileDTO;
  public shouldFail = false;

  async saveUserProfile(profile: SaveUserProfileDTO): Promise<void> {
    if (this.shouldFail) {
      throw new Error("AUTH_REPOSITORY_FAILED");
    }
    this.savedProfile = profile;
  }
}

/* ------------------------------------------------------------------ */
/* Tests                                                              */
/* ------------------------------------------------------------------ */

describe("RegisterUserUseCase", () => {
  const input: RegisterUserInputDTO = {
    fullName: "Fabio Moggi",
    email: "fabio@example.com",
    password: "secure-password-123",
  };

  it("registers a user via auth service and persists user profile", async () => {
    const authService = new InMemoryAuthService();
    const authRepository = new InMemoryAuthRepository();

    const useCase = new RegisterUserUseCase(authService, authRepository);

    const result = await useCase.execute(input);

    expect(result).toEqual({ userId: "test-user-id" });
    expect(authService.receivedInput).toEqual(input);
    expect(authRepository.savedProfile).toEqual({
      id: "test-user-id",
      fullName: "Fabio Moggi",
      email: "fabio@example.com",
    });
  });

  it("throws if auth service fails and does not persist user profile", async () => {
    const authService = new InMemoryAuthService();
    authService.shouldFail = true;

    const authRepository = new InMemoryAuthRepository();

    const useCase = new RegisterUserUseCase(authService, authRepository);

    await expect(useCase.execute(input)).rejects.toThrow("AUTH_SERVICE_FAILED");

    // repository must not be called
    expect(authRepository.savedProfile).toBeUndefined();

    // we still captured the input attempt
    expect(authService.receivedInput).toEqual(input);
  });

  it("throws if repository fails after auth succeeds", async () => {
    const authService = new InMemoryAuthService();

    const authRepository = new InMemoryAuthRepository();
    authRepository.shouldFail = true;

    const useCase = new RegisterUserUseCase(authService, authRepository);

    await expect(useCase.execute(input)).rejects.toThrow("AUTH_REPOSITORY_FAILED");

    // auth succeeded first
    expect(authService.receivedInput).toEqual(input);

    // repository failed before saving
    expect(authRepository.savedProfile).toBeUndefined();
  });

  it("does not leak password into the repository profile payload (even on success)", async () => {
    const authService = new InMemoryAuthService();
    const authRepository = new InMemoryAuthRepository();

    const useCase = new RegisterUserUseCase(authService, authRepository);

    await useCase.execute(input);

    expect(authRepository.savedProfile).toBeDefined();

    // Ensure only expected fields are present
    expect(Object.keys(authRepository.savedProfile as SaveUserProfileDTO).sort()).toEqual(
      ["email", "fullName", "id"].sort()
    );

    // Extra explicit check (defense-in-depth)
    expect((authRepository.savedProfile as any).password).toBeUndefined();
  });
});
