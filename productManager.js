const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 1;
    this.loadProductsFromFile();
  }

  async addProduct(producto) {
    if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
      console.log("Error: Todos los campos del producto son obligatorios.");
      return;
    }

    const codeExists = this.products.some((product) => product.code === producto.code);

    if (codeExists) {
      console.log("Error: Este producto ya existe.");
      return;
    }

    const newProduct = {
      id: this.nextID++,
      title: producto.title,
      description: producto.description,
      price: producto.price,
      thumbnail: producto.thumbnail,
      code: producto.code,
      stock: producto.stock,
    };

    this.products.push(newProduct);
    console.log("Producto agregado:");
    console.log(newProduct);

    await this.saveProductsToFile();
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (product) {
      console.log("Producto encontrado:");
      console.log(product);
    } else {
      console.log("Error: No se encontró el producto con ID " + id);
    }
  }

  async updateProduct(id, updatedProductData) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.log(`Error: No se encontró el producto con ID ${id}`);
      return;
    }
    const updatedProduct = {
      id: this.products[productIndex].id,
      ...updatedProductData,
    };
    this.products[productIndex] = updatedProduct;
    await this.saveProductsToFile();
    console.log(`Producto actualizado con ID ${id}:`);
    console.log(updatedProduct);
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.log(`Error: No se encontró el producto con ID ${id}`);
      return;
    }
    const deletedProduct = this.products.splice(productIndex, 1)[0];
    await this.saveProductsToFile();
    console.log(`Producto eliminado con ID ${id}:`);
    console.log(deletedProduct);
  }
  
  async loadProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      
      // Si los datos leídos no son un arreglo, inicializa this.products como un arreglo vacío
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
    } catch (error) {
      // Si el archivo no existe, inicializamos el array de productos vacío
      if (error.code === 'ENOENT') {
        this.products = [];
        return;
      }
      throw error;
    }
  }
  

  async getProducts() {
    console.log("Lista de productos:");
    this.products.forEach((product) => {
      console.log(product);
    });
  }

  async saveProductsToFile() {  
    try {
      const jsonData = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, jsonData);
      console.log("Datos guardados en el archivo:", this.path);
    } catch (error) {
      console.error("Error al guardar los datos en el archivo:", error);
    }
  }
}

const productManager = new ProductManager('productos.json');

const producto = {
  title: "Producto de prueba 1",
  description: "Este es el primer producto de prueba",
  price: 200,
  thumbnail: "imagen",
  code: "abc123",
  stock: 20,
};

const producto2 = {
  title: "Producto de prueba 2",
  description: "Este es el segundo producto de prueba",
  price: 150,
  thumbnail: "segunda imagen",
  code: "def456",
  stock: 15,
};


productManager.addProduct(producto);
productManager.addProduct(producto2);
productManager.deleteProduct(2);
productManager.getProductById(1);
productManager.getProductById(3);
productManager.updateProduct(1, {
  title: "Producto Actualizado",
  description: "Nueva descripción",
  price: 300,
  thumbnail: "nueva_imagen.jpg",
  code: "xyz789",
  stock: 10,
});
productManager.getProducts()