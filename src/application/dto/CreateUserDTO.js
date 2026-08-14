class CreateUserDTO {
  constructor({ email, password, name }) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}

module.exports = CreateUserDTO;