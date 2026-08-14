const bcrypt = require('bcrypt');
const IPasswordHasher = require('../../application/ports/IPasswordHasher');

class BcryptPasswordHasher extends IPasswordHasher {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = BcryptPasswordHasher;