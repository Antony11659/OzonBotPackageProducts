// keyboards/main.keyboard.js
import { SHOPS } from "../constants/shops.js";

export function createMainKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🏪 Raspiv Parfuma",
            callback_data: SHOPS.RASPIV,
          },
        ],
        [
          {
            text: "🏪 La De Parfum",
            callback_data: SHOPS.LA_DE_PURFUM,
          },
        ],
        [
          {
            text: "🏪 Motive",
            callback_data: SHOPS.MOTIVE,
          },
        ],
        [
          {
            text: "🏪 Dubai Oil",
            callback_data: SHOPS.DUBAI_OIL,
          },
        ],
      ],
    },
  };
}