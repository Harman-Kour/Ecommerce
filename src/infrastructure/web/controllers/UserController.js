const CreateUserDTO = require('../../../application/dto/CreateUserDTO');

// SRP: Only handles HTTP concerns, delegates to use cases
class UserController {
  constructor(registerUserUseCase, getUserUseCase, listUsersUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.listUsersUseCase = listUsersUseCase;
  }

  register = async (req, res, next) => {
    try {
      const dto = new CreateUserDTO(req.body);
      const user = await this.registerUserUseCase.execute(dto);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.getUserUseCase.execute(Number(req.params.id));
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const users = await this.listUsersUseCase.execute();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;