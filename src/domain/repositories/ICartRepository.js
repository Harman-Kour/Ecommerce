class ICartRepository {
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async save(cart) { throw new Error('Not implemented'); }
  async clear(userId) { throw new Error('Not implemented'); }
}

module.exports = ICartRepository;