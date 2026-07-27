import { mapMessages } from "../lib/message.js";


export const makeNextKeyboard = () => {
    return {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: mapMessages.sticking["Next"],
                callback_data: "next"
              }
            ]
          ]
        }
      }
};