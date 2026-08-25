import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { registerCallbackHandler } from "./handlers/callbacks.js";
import { registerStickHandler } from "./handlers/stick.js";

// What should be connected when the application starts?

registerStartHandler(bot);
registerCallbackHandler(bot);
registerStickHandler(bot);

console.log('Bot is running...');

