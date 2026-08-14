class IOrderRepository {
  async create(order) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async updateStatus(id, status) { throw new Error('Not implemented'); }
}

module.exports = IOrderRepository;