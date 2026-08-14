class CreateProductDTO {
  constructor({ name, description, price, stock, category }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }
}

module.exports = CreateProductDTO;