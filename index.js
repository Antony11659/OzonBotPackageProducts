// What should be connected when the application starts?
import { getOrders, sortOrders, generateMessage, paginatePages } from "./lib/utils.js";
import { mapMessages } from "./lib/message.js";
import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { getSession } from "./state/session.js";
import { handleRaspiv } from "./callbacks/raspiv.js";
import { handleNext } from "./callbacks/next.js";

registerStartHandler(bot)

bot.on("callback_query", async (query) => {
  await bot.answerCallbackQuery(query.id);

  if (!query.message) {
    return;
  }

  const chatId = query.message.chat.id;
  const session = getSession(chatId);

  if (query.data === "raspiv"){
    await handleRaspiv(bot, query);
    return;
  }

  if (query.data === 'next') {
    await handleNext(bot, query, session);

    return;
  }

  if (query.data === "packaging") {
    const orders = await getOrders();
    return;
  }

  if (query.data === 'sticking') {
    const orders = await getOrders();

    session.stickingOrders = sortOrders(orders);
    session.currentPage = 0;

    if (session.stickingOrders.length === 0) {
      await bot.sendMessage(chatId, "No orders found.");
      return;

    }

    const amountPages = Math.ceil(session.stickingOrders.length / session.itemsPerPage)

    const { orderPage } = paginatePages(session.stickingOrders, session.currentPage, session.itemsPerPage);

    const message = generateMessage.getStickingMessage(
      orderPage,
      session.currentPage,
      amountPages
    );

    await bot.sendMessage(chatId, message, 
      { 
        parse_mode: "HTML",
        reply_markup: {
         inline_keyboard: [
  
          [

            {
  
              text: mapMessages.sticking['Next'],
  
              callback_data: "next"
  
            }
  
          ]
  
        ]
  
      }
  })

  }
} )

console.log('Bot is running...')

