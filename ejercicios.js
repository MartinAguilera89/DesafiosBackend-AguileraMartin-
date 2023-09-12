class ProductManager {
    constructor() {
      this.products = [];
      this.nextID = 1;
    }
  
    addProduct(producto) {
        const codeExists = this.products.some((product) => product.code === producto.code);
  
      if (codeExists) {
        console.log("Error: Este producto ya existe.");
        return;
      }
  
      const newProduct = {
        ID: this.nextID++,
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
    }
  
    getProductById(id) {
        const product = this.products.find((product) => product.ID === id);
  
        if (product) {
            console.log("Producto encontrado:");
            console.log(product);
        } else {
            console.log("Error: No se encontró el producto ID " + id);
        }
    }
  
    getProducts() {
        console.log("Lista de productos:");
        console.log(this.products);
    }
  }
  
const productManager = new ProductManager();
  
const producto = {
    title: "Producto de prueba 1",
    description: "Este es el primer prod de prueba",
    price: 200,
    thumbnail: "imagen",
    code: "abc123",
    stock: 20,
  };
  
const producto2 = {
    title: "Producto de prueba 2",
    description: "Este es el segundo prod de prueba",
    price: 150,
    thumbnail: "segunda imagen",
    code: "def456",
    stock: 15,
  };

  productManager.addProduct(producto);
  productManager.addProduct(producto2);
  productManager.getProducts();
  productManager.getProductById(1);
  productManager.getProductById(3);