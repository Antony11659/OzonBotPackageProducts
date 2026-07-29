import { makeStickingKeyboard } from "../keyboards/sticking.js";
import { getOrders } from "../lib/utils.js";
import { generateMessage } from "../lib/utils.js";
import { deleteActiveMessage } from "../lib/utils.js";

export const handleRaspiv = async (bot, query, session) => {
  const chatId = query.message.chat.id;

  await deleteActiveMessage(bot, chatId);

  const orders = await getOrders();
  const totalBottlesMessage = generateMessage.getTotalBottles(orders);

  const sentMessage = await bot.sendMessage(chatId, totalBottlesMessage,
    makeStickingKeyboard()
  );
 
  session.activeMessageId = sentMessage.message_id;
};