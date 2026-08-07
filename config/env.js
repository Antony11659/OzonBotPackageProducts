import "dotenv/config";

const required = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};

export const env = {
    telegramToken: required('TELEGRAM_BOT_TOKEN'),
    ozon: {
        raspiv: {
            apiKey: required('OZON_API_KEY_RASPIV'),
            clientId: required('OZON_CLIENT_ID_RASPIV')
        },
        
        motive: {
            apiKey: required('OZON_API_KEY_MOTIVE'),
            clientId: required('OZON_CLIENT_ID_MOTIVE')
        }
    }  
}