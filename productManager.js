const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 1;
    this.iniliatize();
  }

  async iniliatize() {
    try {
        const data = await this.readFile()
        this.products = data
        this.nextID =
            this.products.length > 0
            ? Math.max(...this.products.map(product => product.id)) + 1
            : 1
        }
    catch (error) {
        console.log(
            'Error al inicializar la clase ProductManager: ',
            error.message
        )
        }
    }

  async addProduct(producto) {
    if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
      console.log("Error: Todos los campos del producto son obligatorios.");
      return;
    }

    const codeExists = this.products.some(product => product.code === producto.code);

    if (codeExists) {
      console.log('Error: Este producto ya existe.');
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
    const product = this.products.find(product => product.id === id);

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
    }
    this.products[productIndex] = updatedProduct;
    await this.saveProductsToFile();
    console.log(`Producto actualizado con ID ${id}:`);
    console.log(updatedProduct);
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      console.log(`Error: No se encontró el producto con ID ${id}`);
      return;
    }
    const deletedProduct = this.products.splice(productIndex, 1);
    await this.saveProductsToFile();
    console.log(`Producto eliminado con ID ${id}:`);
    console.log(deletedProduct);
  }
  
  async readFile() {
    let finalData = []
    try {
        finalData = await fs.promises.readFile(this.path, 'utf-8')
        finalData =JSON.parse(finalData)
    }
    catch (error) {
        console.log('error al leer el archivo: ', error.message)
    }
    return finalData
  }
  
  async getProducts() {
    console.log("Lista de productos:");
    return await this.readFile()
  }

  async saveProductsToFile() {  
    try {
      await fs.promises.writeFile
      (this.path, JSON.stringify(this.products, null, 2), 'utf-8');
      console.log("Datos guardados en el archivo:", this.path);
    } catch (error) {
      console.error("Error al guardar los datos en el archivo:", error.message)
      throw error
    }
  }
}

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

const executeCode = async () => {
    const productManager = new ProductManager('productos.json')
        await productManager.iniliatize()

    console.log(await productManager.getProducts())

await productManager.addProduct(producto);
await productManager.addProduct(producto2);
await productManager.deleteProduct(2);
await productManager.getProductById(1);
await productManager.getProductById(3);
await productManager.updateProduct(1, {
  title: "Producto Actualizado",
  description: "Nueva descripción",
  price: 300,
  thumbnail: "nueva_imagen.jpg",
  code: "xyz789",
  stock: 10,
});
    console.log(await productManager.getProducts())
}

executeCode()