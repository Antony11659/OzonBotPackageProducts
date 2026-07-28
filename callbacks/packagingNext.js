import { generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";



export const handlePackagingNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;
    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.packaging.currentPage >= amountPages - 1) {
      await bot.sendMessage(chatId, mapMessages.packaging.finishMessage, makePackagingKeyboard());

      return;
    }

    session.packaging.currentPage ++;

    const { orderPage } = paginatePages(
      session.packaging.orders,
      session.packaging.currentPage,
      session.packaging.itemsPerPage
    );

    const message = generateMessage.getPackageMessage(orderPage, session.packaging.currentPage, amountPages);

    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: mapMessages.packaging["Next"],
              callback_data: "packagingNext"
            }
          ]
        ]
      }
    });
}