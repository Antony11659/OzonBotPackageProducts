import { makePackagingKeyboard } from "../keyboards/packaging.js";
import { generateMessage, paginatePages } from "../lib/utils.js";
import { mapMessages } from "../lib/message.js";
import { deleteActiveMessage } from "../lib/utils.js";
import { makeNextKeyboard } from "../keyboards/next.js";
import { getMinutes } from "../lib/metrics.js";


export const handleStickingNext = async (bot, query, session) => {
    const chatId = query.message.chat.id;

    const amountPages = Math.ceil(session.sticking.orders.length / session.sticking.itemsPerPage);
    const userStickingTime = getMinutes(session.startedAt);

    if (amountPages === 0) {
      return;
    }
  
    if (session.sticking.currentPage >= amountPages - 1) {
      await deleteActiveMessage(bot, chatId);
      const sentMessage = await bot.sendMessage(chatId, mapMessages.sticking.finishMessage(session.amountOfOrders), makePackagingKeyboard());
      session.activeMessageId = sentMessage.message_id;
      
      console.log(`Sticked: ${userStickingTime} min.`);

      return;
    }

    session.sticking.currentPage ++;

    const { orderPage } = paginatePages(
      session.sticking.orders,
      session.sticking.currentPage,
      session.sticking.itemsPerPage
    );

    const message = generateMessage.getStickingMessage(orderPage, session.sticking.currentPage, amountPages);

    await bot.editMessageText(message, makeNextKeyboard(query, 'sticking'));
}