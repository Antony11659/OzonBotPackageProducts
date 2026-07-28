import { generateMessage, getPackageOrders, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";

export const handlePackaging = async(bot, query, session) => {
    const chatId = query.message.chat.id;
    const orders = await getPackageOrders();

    session.packaging.orders = orders;
    session.packaging.currentPage = 0;
    
    const { orderPage } = paginatePages(orders, 0, 5);
    const message = generateMessage.getPackageMessage(orderPage, 0, 5);
    
    await bot.sendMessage(chatId, message,
          { 
              parse_mode: "HTML",
              reply_markup: {
               inline_keyboard: [
      
                [
    
                  {
      
                    text: mapMessages.packaging['Next'],
      
                    callback_data: "packagingNext"
      
                  }
      
                ]
      
              ]
            }
      
        })
    
};

