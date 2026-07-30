import { mapMessages } from "../lib/message.js";


export const makeNextKeyboard = (query, type) => {
    if (query) {
      return {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: mapMessages[type]["Previous"],
              callback_data: `${type}Previous`
            },
            {
              text: mapMessages[type]["Next"],
              callback_data: mapMessages[type].callback
            }
          ]
        ]
      }
    }
    }

      return {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: mapMessages[type]["Next"],
                callback_data: mapMessages[type].callback
              }
            ]
          ]
        }
      }
};