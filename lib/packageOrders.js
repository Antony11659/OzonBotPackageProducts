import { createOzonClient } from "./ozonClient.js";
import { getProductsMap } from "../repositories/productRepository.js";
import { filePath } from "../constants/shops.js";
import { checkUnknownSku } from "../repositories/updateProducts.js";


const getDay = (day = 'today') => {
  const todayObj = new Date();
  const otherDayObj = new Date();
  const today = todayObj.toISOString().split('T')[0];
  
  if (day === 'today') {
    return `${today}T23:59:59.999Z`;
  }

  const newDay = otherDayObj.setDate(todayObj.getDate() + day);
  return otherDayObj.toISOString();
};

const today = getDay('today');
const threeDaysAgo = getDay(-3);

// const createOzonClient = (shop) => {
//   const credentials = env.ozon[shop];

//   if (!credentials) {
//     throw new Error(`Unknown shop: ${shop}`);
//   }

//   return axios.create({
//     baseURL: 'https://api-seller.ozon.ru',
//     headers: {
//       'Client-Id': `${credentials.clientId}`,    // Your Ozon Seller Client ID
//       'Api-Key': `${credentials.apiKey}`,        // Your Ozon API Key
//       'Content-Type': 'application/json'
//     }
//   });
// };

// Start Packaging 
const normalizePostingNumber = (num) => num.slice(num.indexOf("-"));

export const getPackageOrders = async (shopName) => {
  const ozonClient = createOzonClient(shopName);
  const shopFilePath = filePath[shopName];
  const productList = getProductsMap(shopFilePath);

  const allItems = [];
  let cursor = "";

  while (true) {
  try {
    const response = await ozonClient.post('/v3/posting/fbs/list', {
        filter: {
        since: threeDaysAgo,
        to: today,
        status: 'awaiting_deliver'
      },
      limit: 1000,
      cursor: cursor
    });
    const result = response.data.result;

    cursor = result.cursor;
    for (const posting of result.postings) {
      const postingNumber = normalizePostingNumber(posting.posting_number);
      const products = []
      for (const product of posting.products) {
          const sku = product.sku;
          const order = productList[sku];
          if(!order) {
            console.warn(`Unknown SKU: ${product.sku}`);
            continue;
          }
          const { name, volume } = order;
          
          products.push({
            name,
            volume,
        });
      }
      allItems.push({
        postingNumber,
        products,
      })
    }

    if(!result.has_next){
      break;
    }
    
    }   catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        break;
    }
  }
  return allItems;
}
