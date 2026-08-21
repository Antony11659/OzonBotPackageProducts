import { env } from "../config/env.js";
import { parseName } from "../lib/utils.js";
import fs from 'fs';
import axios from "axios";
import { getProductsMap } from "./productRepository.js";
import { filePath } from "../constants/shops.js";

const map = getProductsMap('./data/products.json');

const getAllProducts = async(shopName) => {
    const credentials = env.ozon[shopName];
    const products = [];
    let lastId = "";

    if (!credentials) {
      throw new Error(`Unknown shop: ${shop}`);
    }

    while (true) {
        const { data } = await axios.post(
          "https://api-seller.ozon.ru/v3/product/list",
        {

        filter: {
          visibility: "ALL"
        },

        last_id: lastId,
        limit: 1000
      },

      {
        headers: {
          "Client-Id": credentials.clientId,
          "Api-Key": credentials.apiKey,
          "Content-Type": "application/json"
        }
      }

    );

    products.push(...data.result.items);

    if (!data.result.last_id || data.result.items.length === 0) {

      break;

    }

    lastId = data.result.last_id;

  }

  return products;
};


const createJson = (shopName, list) => {
  fs.writeFileSync(
    filePath[shopName],
    JSON.stringify(list, null, 2),
    "utf-8"
   )
   console.log(`products for ${shopName} created`)
};

const createProductsJson = async(shopName) => {
  const products = await getAllProducts(shopName);

  const notValidProducts = products.filter((el) => {
    const { name, volume } = parseName(el.offer_id);
    if(volume < 0.1) {
      return el
    } 
  });

  const validProducts = products.filter((el) => {
    const { name, volume } = parseName(el.offer_id);
    if(volume >= 0.1) {
      return el
    } 
  });

  if (notValidProducts.length > 0){
    const notValidProductsList = notValidProducts.reduce((acc, el) => {
      const { name, volume } = parseName(el.offer_id);
       acc[el.sku] = {
        ozonName: el.offer_id,
        name: map[name] ?? name,
        volume: volume,
        quantity: 1,
      };
      return acc;
    }, {});

    createJson(`not_valid_${shopName}`, notValidProductsList);
  }

  const productsList = validProducts.reduce((acc, el) => {
    const { name, volume } = parseName(el.offer_id);
     acc[el.sku] = {
      ozonName: el.offer_id,
      name: map[name] ?? name,
      volume: volume,
      quantity: 1
    };
    return acc;
  }, {});

    createJson(shopName, productsList);

};

export const checkUnknownSku = async(shopName) => {
  const filePathShop = filePath[shopName];
  const products = await getAllProducts(shopName);
  const list = getProductsMap(filePathShop);
  
  const unknownSkuList = products.filter(el => !list[el.sku]);

  if(unknownSkuList.length > 0) {
    fs.writeFileSync(`./repositories/unknownSku/${shopName}.json`, JSON.stringify(unknownSkuList, null, 2), 'utf-8');
    console.log(`Unknown Sku list is in ./repositories/unknownSku/${shopName}.json`);
  } else {
    console.log('There is no unknown SKU');
  }
  return unknownSkuList.length > 0;
};
