import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { registerCallbackHandler } from "./handlers/callbacks.js";

// What should be connected when the application starts?

await registerStartHandler(bot);
await registerCallbackHandler(bot);
// bot.on("callback_query", async (query) => {
//   await bot.answerCallbackQuery(query.id);

//   if (!query.message) {
//     return;
//   }

//   const chatId = query.message.chat.id;
//   const session = getSession(chatId);

//   if (query.data === "raspiv"){
//     await handleRaspiv(bot, query, session);
//     return;
//   }

//   if (query.data === "stickingPrevious") {
//     await handleStickingPrevious(bot, query, session);
//   }

//   if (query.data === 'stickingNext') {
//     await handleStickingNext(bot, query, session);
//     return;
//   }

//   if (query.data === 'packagingNext') {
//     await handlePackagingNext(bot, query, session);
//     return;
//   }

//   if (query.data === 'packagingPrevious') {
//     await handlePackagingPrevious(bot, query, session);
//     return;
//   }

//   if (query.data === "packaging") {
//     await handlePackaging(bot, query, session);
//     return;
//   }

//   if (query.data === 'sticking') {
//     await handleSticking(bot, query, session);
//   }
//   return;
// } )j

console.log('Bot is running...')

