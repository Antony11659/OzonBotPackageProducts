import { makeStickingKeyboard } from "../keyboards/sticking.js";
import { getOrders } from "../lib/utils.js";
import { generateMessage } from "../lib/utils.js";
import { deleteActiveMessage } from "../lib/utils.js";
import { checkUnknownSku } from "../repositories/updateProducts.js";

export const handleShop = async (bot, query, session) => {
  const chatId = query.message.chat.id;
  session.shopName = query.data;

  checkUnknownSku(session.shopName);

  await deleteActiveMessage(bot, chatId);

  const { orders, amountOfOrders, packageOrders } = await getOrders(session.shopName);

  session.packaging.orders = packageOrders;
  session.amountOfOrders = amountOfOrders;
  session.groupedOrders = orders;

  console.log(
    `Shop Name: ${session.shopName}\n`+
    `User: ${query.from.username}\n`+
    `Amount of orders = ${session.amountOfOrders}\n`+
    `--------------------`
    );
  
  const totalBottlesMessage = generateMessage.getTotalBottles(orders);
  
  const sentMessage = await bot.sendMessage(chatId, totalBottlesMessage,
    makeStickingKeyboard()
  );
 
  session.activeMessageId = sentMessage.message_id;
};