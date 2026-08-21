import fs from 'fs';

// const PRODUCTS_FILE = './data/products.json';

export const getProductsMap = (productsFile) => {

    const data = fs.readFileSync(productsFile, "utf-8");
  
    return JSON.parse(data);
  
  };

  