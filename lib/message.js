const users = {
    alina_snik: ['Алиша 🫶', 'Алиночка 💋', 'Алина наша красавица! 🥰'],
    vvviktoryy: ["Вика ☺️", "Виктория 🤗"],
    anton_shur: ['Admin', 'Owner']
}

export const mapMessages = {
    mainPage: {
      startMessage: (userName) => {
        const user = users[userName][Math.floor(Math.random() * users[userName].length)];

        if (!user) {
            return `Привет выбери магазин: `
        }

        return `Привет👋😊, ${ user } \nВыбери магазин 🛍️: `
    },
      packMessage: "📦 Подготовь следуещее количество флаконов: \n",
      amountOrders: "📦 Количество заказов равно: ",
      halfMl: "Количество <i>нольпяток:</i>: ",
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
        halfMl: "<i>нольпяток:</i>: ",
        oneMl: "<i>cамовыкупов:</i>: ",
        threeMl: "<i>трешек</i>: ",
        fiveMl: "<i>пятишек</i>: ",
        tenMl: "<i>десяток</i>: ",
        twentyMl: "<i>двадцаток</i>: ",
        thirtyMl: "<i>тридцаток</i>: ",
        fiftyMl: "<i>полтиников</i>: ",
        Next: "Следующее",
        Previous: "Предидущие",
        finishMessage: "🎉 Поклейка закончена!"
    },
        
    packaging: {
        startMessage: "Начать Упаковку",
        callback: "packagingNext",
        Next: "Следующее",
        Previous: "Предидущие",
        finishMessage: (orders, userPackagingTime) => {
            return `....🎉 🎉 🎉.... \n Упаковкa закончена!\n ✅ Ты собрала ${orders} заказa 👍!\nЗа ${userPackagingTime} мин. ⏳🥇!\nMолодчина 💃🥂🎉🥳✨ `
        }
    
    },
    
}