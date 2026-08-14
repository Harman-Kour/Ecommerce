// Interface/Port - defines contract, implementation agnostic
class IUserRepository {
  async create(user) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async update(user) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;