const express = require('express');
const fs = require('fs');
const app = express();
const puerto = 8080;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 1;
    this.initialize();
  }

  async initialize() {
    try {
      const data = await this.readFile();
      this.products = data;
      this.nextID =
        this.products.length > 0
          ? Math.max(...this.products.map(product => product.id)) + 1
          : 1;
    } catch (error) {
      console.log('Error al inicializar la clase ProductManager: ', error.message);
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

  async readFile() {
    let finalData = [];
    try {
      finalData = await fs.promises.readFile(this.path, 'utf-8');
      finalData = JSON.parse(finalData);
    } catch (error) {
      console.log('error al leer el archivo: ', error.message);
    }
    return finalData;
  }

  async getProducts() {
    return await this.readFile();
  }

  async saveProductsToFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
      console.log('Datos guardados en el archivo:', this.path);
    } catch (error) {
      console.error('Error al guardar los datos en el archivo:', error.message);
      throw error;
    }
  }
}

const productManager = new ProductManager('productos.json');

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

app.listen(puerto, () => {
  console.log(`Servidor Express en ejecución en el puerto ${puerto}`);
});
