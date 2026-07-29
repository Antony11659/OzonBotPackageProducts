import { makePackagingKeyboard } from "../keyboards/packaging.js";
import { generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";
import { deleteActiveMessage } from "../lib/utils.js";


export const handleStickingNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;

    const amountPages = Math.ceil(session.sticking.orders.length / session.sticking.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.sticking.currentPage >= amountPages - 1) {
      await deleteActiveMessage(bot, chatId);
      const sentMessage = await bot.sendMessage(chatId, mapMessages.sticking.finishMessage, makePackagingKeyboard());
      session.activeMessageId = sentMessage.message_id;
      return;
    }

    session.sticking.currentPage ++;

    const { orderPage } = paginatePages(
      session.sticking.orders,
      session.sticking.currentPage,
      session.sticking.itemsPerPage
    );

    const message = generateMessage.getStickingMessage(orderPage, session.sticking.currentPage, amountPages);

    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: mapMessages.sticking["Next"],
              callback_data: "stickingNext"
            }
          ]
        ]
      }
    });
}