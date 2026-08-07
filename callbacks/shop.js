import { makeStickingKeyboard } from "../keyboards/sticking.js";
import { getOrders } from "../lib/utils.js";
import { generateMessage } from "../lib/utils.js";
import { deleteActiveMessage } from "../lib/utils.js";

export const handleShop = async (bot, query, session) => {
  const chatId = query.message.chat.id;
  session.shopName = query.data;

  await deleteActiveMessage(bot, chatId);

  const { orders, amountOfOrders } = await getOrders(session.shopName);
  session.amountOfOrders = amountOfOrders;
  session.groupedOrders = orders;

  console.log(`Shop Name: ${session.shopName} \namount of orders = ${session.amountOfOrders} \n${new Date().toISOString()}`);
  
  const totalBottlesMessage = generateMessage.getTotalBottles(orders);
  
  const sentMessage = await bot.sendMessage(chatId, totalBottlesMessage,
    makeStickingKeyboard()
  );
 
  session.activeMessageId = sentMessage.message_id;
};