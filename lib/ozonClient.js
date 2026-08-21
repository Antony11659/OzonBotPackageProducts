import axios from "axios";
import { env } from "../config/env.js"

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
  
  export const createOzonClient = (shop) => {
    const credentials = env.ozon[shop];
  
    if (!credentials) {
      throw new Error(`Unknown shop: ${shop}`);
    }
  
    return axios.create({
      baseURL: 'https://api-seller.ozon.ru',
      headers: {
        'Client-Id': `${credentials.clientId}`,    // Your Ozon Seller Client ID
        'Api-Key': `${credentials.apiKey}`,        // Your Ozon API Key
        'Content-Type': 'application/json'
      }
    });
  };
  