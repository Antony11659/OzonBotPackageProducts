// What should be connected when the application starts?
import { getOrders, sortOrders, generateMessage, paginatePages } from "./lib/utils.js";
import { mapMessages } from "./lib/message.js";
import { bot } from "./tgBot.js";
import { createMainKeyboard } from "./keyboards/main.js";


let sentMessages = [];
let stickingOrders = [];
let currentPage = 0;
let itemsPerPage = 3;

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    mapMessages.mainPage.startMessage,
    createMainKeyboard()
  );
});

bot.onText(/\/orders/, async (msg) => {
  const chatId = msg.chat.id;

  for(const messageId of sentMessages) { 
    await bot.deleteMessage(chatId, messageId) 
  }

  const orders = await getOrders();
  const orderMessage = generateMessage.getOrders(orders);
  const totalBottlesMessage = generateMessage.getTotalBottles(orders);

  const sentOrderMessage = await bot.sendMessage(chatId, orderMessage );
  const sentTotalBottlesMessage = await bot.sendMessage(chatId, totalBottlesMessage);
  sentMessages = [];
  sentMessages.push(sentOrderMessage.message_id); 
  sentMessages.push(sentTotalBottlesMessage.message_id);
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  if (query.data === "raspiv"){

    const orders = await getOrders();
    const orderMessage = generateMessage.getOrders(orders);
    const totalBottlesMessage = generateMessage.getTotalBottles(orders);
  
    const sentTotalBottlesMessage = await bot.sendMessage(chatId, totalBottlesMessage,
      { 
        parse_mode: "HTML",
        reply_markup: {
        inline_keyboard: [
    
          [
    
            {
    
              text: mapMessages.mainPage.startSticking,
    
              callback_data: "sticking"
    
            }
    
          ]
    
        ]
    
      }
    });
  }

  if (query.data === 'next') {
    const amountPages = Math.ceil(stickingOrders.length / itemsPerPage);
    if (currentPage < amountPages -1 ) {
      currentPage ++;
    }

    if (currentPage === amountPages - 1) {
      await bot.sendMessage(chatId, mapMessages.sticking.finishMessage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: mapMessages.packaging["startPackaging"],
                callback_data: "packaging"
              }
            ]
          ]
        }
      });
      return;
    }

    const { orderPage } = paginatePages(stickingOrders, currentPage, itemsPerPage);
    const message = generateMessage.getStickingMessage(orderPage, currentPage, amountPages);

    await bot.editMessageText(message, {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: mapMessages.sticking["Next"],
              callback_data: "next"
            }
          ]
        ]
      }
    })

    await bot.answerCallbackQuery(query.id);
  }

  if (query.data === "packaging") {
    const orders = await getOrders();
  }

  if (query.data === 'sticking') {
    const orders = await getOrders();
    stickingOrders = sortOrders(orders);
    const amountPages = Math.ceil(stickingOrders.length / itemsPerPage)
    const { 
      orderPage
    } = paginatePages(stickingOrders, currentPage, itemsPerPage);

    const message = generateMessage.getStickingMessage(orderPage, currentPage, amountPages);

    await bot.sendMessage(chatId, message, 
      { 
        parse_mode: "HTML",
        reply_markup: {
         inline_keyboard: [
  
          [

            {
  
              text: mapMessages.sticking['Next'],
  
              callback_data: "next"
  
            }
  
          ]
  
        ]
  
      }
  })

  }
} )

console.log('Bot is running...')

