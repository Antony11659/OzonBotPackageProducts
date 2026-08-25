import { bot } from "./tgBot.js";
import { registerStartHandler } from "./handlers/start.js";
import { registerCallbackHandler } from "./handlers/callbacks.js";
import { registerStickHandler } from "./handlers/stick.js";
import { registerPackageHandler } from "./handlers/package.js";

// What should be connected when the application starts?

registerStartHandler(bot);
registerCallbackHandler(bot);
registerStickHandler(bot);
registerPackageHandler(bot);

console.log('Bot is running...');

