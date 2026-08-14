// Pure entity - no framework dependencies
class User {
  constructor({ id, email, passwordHash, name, role, createdAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.role = role || 'customer';
    this.createdAt = createdAt || new Date();
  }

  isAdmin() {
    return this.role === 'admin';
  }

  updateName(name) {
    this.name = name;
  }
}

module.exports = User;