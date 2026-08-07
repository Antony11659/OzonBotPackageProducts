import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { registerCallbackHandler } from "./handlers/callbacks.js";

// What should be connected when the application starts?

await registerStartHandler(bot);
await registerCallbackHandler(bot);

console.log('Bot is running...')

