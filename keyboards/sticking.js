import { mapMessages } from "../lib/message.js"

export const makeStickingKeyboard = () => {
    return { 
            parse_mode: "HTML",
            reply_markup: {
            inline_keyboard: [
        
              [
        
                {
        
                  text: mapMessages.mainPage.startSticking,
        
                  callback_data: "sticking"
        
                }
        
              ]
        
            ]
        
          }
        }
}