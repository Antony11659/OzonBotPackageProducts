import { getSession } from "../state/session.js";
import { handleRaspiv } from "../callbacks/raspiv.js";
import { handleStickingNext } from "../callbacks/stickingNext.js";
import { handleSticking } from "../callbacks/sticking.js";
import { handlePackaging } from "../callbacks/packaging.js";
import { handlePackagingNext } from "../callbacks/packagingNext.js";
import { handleStickingPrevious } from "../callbacks/stickingPrevious.js";
import { handlePackagingPrevious } from "../callbacks/packagingPrevious.js";

const callbackHandlers = {
    raspiv: handleRaspiv,
    sticking: handleSticking,
    stickingNext: handleStickingNext,
    stickingPrevious: handleStickingPrevious,
    packaging: handlePackaging,
    packagingNext: handlePackagingNext,
    packagingPrevious: handlePackagingPrevious,
  };

export const registerCallbackHandler = (bot) => {
    bot.on("callback_query", async (query) => {
        await bot.answerCallbackQuery(query.id);
  
        if (!query.message) {
          return;
        }
  
        const handler = callbackHandlers[query.data]
  
        if (!handler) {
          console.warn(`Unknown callback: ${query.data}`);
          return;
        }
  
        const chatId = query.message.chat.id;
        const session = getSession(chatId);
  
        await handler(bot, query, session);
    })
  };