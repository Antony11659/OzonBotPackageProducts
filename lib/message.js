const users = {
    alina_snik: ['Алиша, милашка - очаровашка! 🫶😻', 'Алиночка 💋', 'Алина, наша красавица! 🥰', "Наша Алина симпотяжка! 💞 💓 💗"],
    vvviktoryy: ["Вика 👋😊", "Виктория 🤗", "Виктория Михайловна 😉🤟" ],
    anton_shur: ['Antosha - Kartosha 👋😊', 'Anton 👋😊'],
    dmitry_sellerov: ['Димон - Пантилимон 👋😊']
}

export const mapMessages = {
    mainPage: {
      startMessage: (userName) => {
        const userMessage = users[userName];

        if (!userMessage) {
            return `Привет выбери магазин: `
        }

        const user = userMessage[Math.floor(Math.random() * users[userName].length)];

        return `Привет, ${ user } \nВыбери магазин 🛍️: `
    },

      packMessage: "📦 Подготовь следуещее количество флаконов: \n",
      amountOrders: "📦 Количество заказов равно: ",
      halfMl: "Количество <i>нольпяток</i>: ",
      oneMl: "Количество <i>cамовыкупов</i>: ",
      threeMl: "Количество <i>трешек</i>: ",
      fiveMl: "Количество <i>пятишек</i>: ",
      tenMl: "Количество <i>десяток</i>: ",
      twentyMl: "Количество <i>двадцаток</i>: ",
      thirtyMl: "Количество <i>тридцаток</i>: ",
      fiftyMl: "Количество <i>полтиников</i>: "
    },
    sticking: {
        startMessage: "🏷️ Начать Клейть",
        callback: "stickingNext",
        halfMl: "<i>нольпяток</i>: ",
        oneMl: "<i>cамовыкупов</i>: ",
        threeMl: "<i>трешек</i>: ",
        fiveMl: "<i>пятишек</i>: ",
        tenMl: "<i>десяток</i>: ",
        twentyMl: "<i>двадцаток</i>: ",
        thirtyMl: "<i>тридцаток</i>: ",
        fiftyMl: "<i>полтиников</i>: ",
        Next: "Следующие",
        Previous: "Предыдущие",
        finishMessage: (orders) => {
            return `🎉 Поклейка закончена!\n ✅ Ты наклела ${orders} заказов 🥇!\n`
        }
    },
        
    packaging: {
        startMessage: "Начать Упаковку",
        callback: "packagingNext",
        Next: "Следующие",
        Previous: "Предыдущие",
        finishMessage: (orders) => {
            return `....🎉 🎉 🎉.... \n Упаковкa закончена!\n ✅ Ты собрала ${orders} заказa 👍!\nMолодчина 💃🥂🎉🥳✨ `
        }
    
    },
    
}