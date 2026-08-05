import axios from "axios";
import { env } from "../config/env.js"
import { getSession } from "../state/session.js";
import fs from 'fs';

import { mapMessages } from "./message.js";

const map = JSON.parse(

  fs.readFileSync('./products.json', 'utf-8')

);

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

const ozonClient = axios.create({
    baseURL: 'https://api-seller.ozon.ru',
    headers: {
      'Client-Id': `${env.ozon.raspiv.clientId}`,    // Your Ozon Seller Client ID
      'Api-Key': `${env.ozon.raspiv.apiKey}`,        // Your Ozon API Key
      'Content-Type': 'application/json'
    }
  });

 const parseName = (str) => {
    const match = str.match(/^(.*?)[_\s]*(\d+)\s*m+l*_?[.,!?]*$/i);
  
    if (!match) {
      return {
        name: str.trim(),
        volume: 5, // default volume
      };
    }
  
    return {
      name: match[1].trim().replace(/[_\s]+$/, ""),
      volume: Number(match[2]),
    };
  }

  const normalizeName = (offerId) => {
    const { name } = parseName(offerId);
    return map[name] ?? offerId;
  };

  const groupItems = (items) => {
    const groupedItems = {}
    items.forEach((el) => {
        const key = el.rowName
        if(groupedItems[key]) {
            groupedItems[key].quantity += 1
        } else {
            groupedItems[key] = {...el};
        }
    })
    return Object.values(groupedItems);
  }

// start getOrders

  export async function getOrders() {
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
      
      console.log(`amount of orders = ${result.postings.length}`);
      
      cursor = result.cursor;
      for (const posting of result.postings) {
        for (const product of posting.products) {
            const name = normalizeName(product.offer_id);
            const {volume} = parseName(product.offer_id)
            const item = {
                rowName: product.offer_id,
                name: name,
                volume: volume,
                quantity: 1,
            }
            allItems.push(item);
        }
      }

      if(!result.has_next){
        break;
      }
      
      }   catch (error) {
          console.error('API Error:', error.response?.data || error.message);
          break;
      }
    }
    return groupItems(allItems);
  }
// end getOrders



// start Sort Orders Logic
const updateOrderVolume = (order, updatedOrder) => {
  const increment = order.quantity;

  if (order.volume === 3) {
    updatedOrder.threeMl += increment
  }
  if (order.volume === 5) {
    updatedOrder.fiveMl += increment
  }
  if (order.volume === 10) {
    updatedOrder.tenMl += increment
  }
  if (order.volume === 20) {
    updatedOrder.twentyMl += increment
  }
  if (order.volume === 30) {
    updatedOrder.thirtyMl += increment
  }
  if (order.volume === 50) {
    updatedOrder.fiftyMl += increment
  }

  updatedOrder.count += increment;
};

export const sortOrders = (orders) => {
  const ordersList = {}
  orders.forEach(el => {
    const { name } = el;
    if (!ordersList[name]){
      const newEl = {
        name: name,
        threeMl: 0,
        fiveMl: 0,
        tenMl: 0,
        twentyMl: 0,
        thirtyMl: 0,
        fiftyMl: 0,
        count: 0,
      }

      updateOrderVolume(el, newEl);
      ordersList[name] = newEl;
    } else {
      updateOrderVolume(el, ordersList[name]);
    }
  })
  return Object.values(ordersList).sort((a, b) => b.count - a.count)
}

// end Sort Orders Logic

// Start Generate TgBot Message

const generateTotalBottlesMessage = (totalBottles) => {
  let message = mapMessages.mainPage.packMessage
  for(const key in totalBottles) {
    message += `${mapMessages.mainPage[key]}${totalBottles[key]}\n`
  }
  return message;
}

const countTotalBottles = (orders) => {
  const bottles = {
    threeMl: 0,
    fiveMl: 0,
    tenMl: 0,
    twentyMl: 0,
    thirtyMl: 0,
    fiftyMl: 0,
  }
  orders.reduce((acc, item) => {
    for(const key in acc) {
      acc[key] += item[key];
    }
    return acc
  }, bottles)
  
  return bottles;
}

// Start Generate Stick Message 

const generateBottles = (order) => {
  const bottles = [];
  for (const [ key, value ] of Object.entries(order) ) {
    if (mapMessages.sticking[key] && value > 0) {
        bottles.push(`• ${mapMessages.sticking[key]} <b>${value}</b> шт.\n`);
    }
  }
  return bottles
}

// End Generate Stick Message 


export const generateMessage = {
  getOrders (orders) {
    return `${mapMessages.mainPage.amountOrders} ${orders.length} `;
  },

  getTotalBottles (orders) {
    const sortedOrders = sortOrders(orders);
    const totalBottles = countTotalBottles(sortedOrders);
    const message = generateTotalBottlesMessage(totalBottles);
    return message;
  },

  getStickingMessage (orders, page, amountPages) {

    const orderInfo = orders.map((order) => {
      const perfumeName = order.name
      const stickers = order.count;
      const bottles = generateBottles(order);
      const isOneBottle = bottles.length < 2;
      const manyBottlesMessageLines = [
        "",
        `🌸 Название: <u><b>${perfumeName}</b></u>`,
        "",
        ...bottles,
        "",
        `🏷️ Этикеток: ${stickers} шт`,
        "———————————————————"
         ];

      const oneBottleMessageLine = [
        "",
        `🌸 Название: <u><b>${perfumeName}</b></u>`,
        "",
        ...bottles,
        "———————————————————"
         ];

      const orderInfoLines = isOneBottle ? oneBottleMessageLine : manyBottlesMessageLines ; 
    
     return orderInfoLines.join("\n");
    })
    
    const messageLines = [`📃 Страница ${page + 1} из ${amountPages}`,   '———————————————————', ...orderInfo]
    return messageLines.join("\n");
  },

  getPackageMessage (orders, currentPage, amountOfPages) {
    let message = `🧾 Страница ${currentPage + 1} из ${amountOfPages}`
    const productItems = orders.map((order) => {
      let products = `♦️ <u><b>${order.postingNumber} </b></u>: \n`
      for (const product of order.products) {
        const productLine = `<b>${product.name} ${product.volume} ml </b>\n`
        products += productLine;
      }
      return products;
    })
  
    const messageLines = [
      "",
      message,
      ...productItems,
     ]
    return messageLines.join("———————————————————\n")
  }

}

// End Generate TgBot Message

// Start Pagination Pages

export const paginatePages = (orders, page = 0, perPage = 1) => {
  let itemsPerPage = perPage;
  let pageStart = page * itemsPerPage;
  let pageEnd = pageStart + itemsPerPage;
  const orderPage = orders.slice(pageStart, pageEnd);
  return {
    orderPage,
    page
  }
}

// End Pagination Pages

// Start Packaging 
const normalizePostingNumber = (num) => num.slice(num.indexOf("-"));

export const getPackageOrders = async () => {
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
          const name = normalizeName(product.offer_id);
          const {volume} = parseName(product.offer_id)
          const item = {
              name: name,
              volume: volume,
          }
          products.push(item);
      }
      allItems.push({
        postingNumber: postingNumber,
        products: products,
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

// End Packaging

// Start Deleting Previous Message Logic

export const deleteActiveMessage = async(bot, chatId) => {
  const session = getSession(chatId);

  if (!session.activeMessageId) {
    return;
  }
  
  try {
    await bot.deleteMessage(chatId, session.activeMessageId);
  } catch (err) {
    console.log(
      "Could not delete active message:",
      err.message
    );
  }

  session.activeMessageId = null;
};

// End Deleting Previous Message Logic

