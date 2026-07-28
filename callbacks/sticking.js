import { getOrders } from "../lib/utils.js";
import { sortOrders, paginatePages, generateMessage } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";


export const handleSticking = async(bot, query, session) => {
    const chatId = query.message.chat.id;
    const orders = await getOrders();

    session.sticking.orders = sortOrders(orders);
    session.sticking.currentPage = 0;

    if (session.sticking.orders.length === 0) {
      await bot.sendMessage(chatId, "No orders found.");
      return;
    }

    const amountPages = Math.ceil(session.sticking.orders.length / session.sticking.itemsPerPage);

    const { orderPage } = paginatePages(session.sticking.orders, session.sticking.currentPage, session.sticking.itemsPerPage);

    const message = generateMessage.getStickingMessage(
      orderPage,
      session.sticking.currentPage,
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
  
              callback_data: "stickingNext"
  
            }
  
          ]
  
        ]
  
      }
  })

};