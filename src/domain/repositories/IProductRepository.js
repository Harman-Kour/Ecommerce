class IProductRepository {
  async create(product) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filters) { throw new Error('Not implemented'); }
  async update(product) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async updateStock(id, quantity) { throw new Error('Not implemented'); }
}

module.exports = IProductRepository;