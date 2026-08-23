import { mapMessages } from "../lib/message.js"

export const makeStickingKeyboard = () => {
    return { 
            parse_mode: "HTML",
            reply_markup: {
            inline_keyboard: [
        
              [
        
                {
        
                  text: mapMessages.sticking.startMessage,
                  callback_data: "sticking",
                  style: "success",
        
                }
        
              ]
        
            ]
        
          }
        }
}