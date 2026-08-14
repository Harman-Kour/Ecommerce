const User = require('../../../domain/entities/User');

// SRP: Only handles user registration logic
class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(dto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    
    const user = new User({
      email: dto.email,
      passwordHash,
      name: dto.name
    });

    return await this.userRepository.create(user);
  }
}

module.exports = RegisterUserUseCase;