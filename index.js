// What should be connected when the application starts?
import { getOrders, sortOrders, generateMessage, paginatePages } from "./lib/utils.js";
import { mapMessages } from "./lib/message.js";
import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { getSession } from "./state/session.js";


// let sentMessages = [];
// let stickingOrders = [];
// let currentPage = 0;
// let itemsPerPage = 3;

registerStartHandler(bot)

bot.on("callback_query", async (query) => {
  await bot.answerCallbackQuery(query.id);

  if (!query.message) {
    return;
  }

  const chatId = query.message.chat.id;
  const session = getSession(chatId);

  if (query.data === "raspiv"){
    const orders = await getOrders();
    const totalBottlesMessage = generateMessage.getTotalBottles(orders);
  
    await bot.sendMessage(chatId, totalBottlesMessage,
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

    return;
  }

  if (query.data === 'next') {
    const amountPages = Math.ceil(session.stickingOrders.length / session.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.currentPage >= amountPages - 1) {
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

    session.currentPage ++;

    const { orderPage } = paginatePages(
      session.stickingOrders,
      session.currentPage,
      session.itemsPerPage
    );

    const message = generateMessage.getStickingMessage(orderPage, session.currentPage, amountPages);

    await bot.editMessageText(message, {
      chat_id: chatId,
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
    });

    return;
  }

  if (query.data === "packaging") {
    const orders = await getOrders();
    return;
  }

  if (query.data === 'sticking') {
    const orders = await getOrders();

    session.stickingOrders = sortOrders(orders);
    session.currentPage = 0;

    if (session.stickingOrders.length === 0) {
      await bot.sendMessage(chatId, "No orders found.");
      return;

    }

    const amountPages = Math.ceil(session.stickingOrders.length / session.itemsPerPage)

    const { orderPage } = paginatePages(session.stickingOrders, session.currentPage, session.itemsPerPage);

    const message = generateMessage.getStickingMessage(
      orderPage,
      session.currentPage,
      amountPages
    );

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

