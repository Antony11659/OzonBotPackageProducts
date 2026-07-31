import { deleteActiveMessage, generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";
import { makeNextKeyboard } from "../keyboards/next.js";
import { deleteSession } from "../state/session.js";


export const handlePackagingNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;

    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.packaging.currentPage >= amountPages - 1) {
      await deleteActiveMessage(bot, chatId);
      const sentMessage = await bot.sendMessage(chatId, mapMessages.packaging.finishMessage(session.packaging.orders.length));
      session.activeMessageId = sentMessage.message_id;
      
      setTimeout(async () => {
        try {
          await deleteActiveMessage(bot, chatId, session);
          deleteSession(chatId);
        } catch (error) {
          console.error(
            "Failed to clean up packaging session:",
            error
          );
        }
      }, 5000);
  
      return;
    }

    session.packaging.currentPage ++;

    const { orderPage } = paginatePages(
      session.packaging.orders,
      session.packaging.currentPage,
      session.packaging.itemsPerPage
    );

    const message = generateMessage.getPackageMessage(orderPage, session.packaging.currentPage, amountPages);

    await bot.editMessageText(message, makeNextKeyboard(query, 'packaging'));
}