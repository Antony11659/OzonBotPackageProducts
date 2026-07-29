import { generateMessage, getPackageOrders, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";
import { deleteActiveMessage } from "../lib/utils.js";

export const handlePackaging = async(bot, query, session) => {
    const chatId = query.message.chat.id;

    await deleteActiveMessage(bot, chatId);

    const orders = await getPackageOrders();
    
    session.packaging.orders = orders;
    session.packaging.currentPage = 0;

    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);
    
    const { orderPage } = paginatePages(orders,  session.packaging.currentPage, amountPages);
    const message = generateMessage.getPackageMessage(orderPage,  session.packaging.currentPage, amountPages);
    
    const sentMessage = await bot.sendMessage(chatId, message,
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
    
    session.activeMessageId = sentMessage.message_id;
};

