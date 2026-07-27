import { makePackagingKeyboard } from "../keyboards/packaging.js";
import { generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";



export const handleNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;
    const amountPages = Math.ceil(session.stickingOrders.length / session.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.currentPage >= amountPages - 1) {
      await bot.sendMessage(chatId, mapMessages.sticking.finishMessage, makePackagingKeyboard());

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
}