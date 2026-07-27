import { mapMessages } from "../lib/message.js";


export const makePackagingKeyboard = () => {
    return {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: mapMessages.packaging["startPackaging"],
                callback_data: "packaging"
              }
            ]
          ]
        }
      }
};