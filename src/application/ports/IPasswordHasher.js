class IPasswordHasher {
  async hash(password) { throw new Error('Not implemented'); }
  async compare(password, hash) { throw new Error('Not implemented'); }
}

module.exports = IPasswordHasher;