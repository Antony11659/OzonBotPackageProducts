// What should be connected when the application starts?

import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { getSession } from "./state/session.js";
import { handleRaspiv } from "./callbacks/raspiv.js";
import { handleStickingNext } from "./callbacks/stickingNext.js";
import { handleSticking } from "./callbacks/sticking.js";
import { handlePackaging } from "./callbacks/packaging.js";
import { handlePackagingNext } from "./callbacks/packagingNext.js";
import { handleStickingPrevious } from "./callbacks/stickingPrevious.js";
import { handlePackagingPrevious } from "./callbacks/packagingPrevious.js";

await registerStartHandler(bot);

bot.on("callback_query", async (query) => {
  await bot.answerCallbackQuery(query.id);

  if (!query.message) {
    return;
  }

  const chatId = query.message.chat.id;
  const session = getSession(chatId);

  if (query.data === "raspiv"){
    await handleRaspiv(bot, query, session);
    return;
  }

  if (query.data === "stickingPrevious") {
    await handleStickingPrevious(bot, query, session);
  }

  if (query.data === 'stickingNext') {
    await handleStickingNext(bot, query, session);
    return;
  }

  if (query.data === 'packagingNext') {
    await handlePackagingNext(bot, query, session);
    return;
  }

  if (query.data === 'packagingPrevious') {
    await handlePackagingPrevious(bot, query, session);
    return;
  }

  if (query.data === "packaging") {
    await handlePackaging(bot, query, session);
    return;
  }

  if (query.data === 'sticking') {
    await handleSticking(bot, query, session);
  }
  return;
} )

console.log('Bot is running...')

