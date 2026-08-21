import { deleteActiveMessage } from "../lib/utils.js";
import { sortOrders, paginatePages, generateMessage } from "../lib/utils.js";
import { makeNextKeyboard } from "../keyboards/next.js";


export const handleSticking = async(bot, query, session) => {
    const chatId = query.message.chat.id;

    await deleteActiveMessage(bot, chatId);

    session.sticking.orders = sortOrders(session.groupedOrders);
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

    const sentMessage = await bot.sendMessage(chatId, message, makeNextKeyboard(null, 'sticking'));

  session.activeMessageId = sentMessage.message_id;

};