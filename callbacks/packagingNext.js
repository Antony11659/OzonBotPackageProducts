import { deleteActiveMessage, generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";
import { makeNextKeyboard } from "../keyboards/next.js";
import { deleteSession } from "../state/session.js";
import { getMinutes } from "../lib/metrics.js";
import { admin } from "../constants/admin.js";


export const handlePackagingNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;

    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);

    if (amountPages === 0) {
      return;
    }
  
    if (session.packaging.currentPage >= amountPages - 1) {
      await deleteActiveMessage(bot, chatId);

      const userPackagingTime = getMinutes(session.startedAt);
      const sentMessage = await bot.sendMessage(chatId, mapMessages.packaging.finishMessage(session.amountOfOrders, userPackagingTime));
      
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
      }, 7000);

      await bot.sendMessage(admin.chatId,
        `User ${query.from.username} packaged ${session.amountOfOrders} for ${userPackagingTime} min.`
      )
      
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