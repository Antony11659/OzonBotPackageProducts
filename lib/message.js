export const mapMessages = {
    mainPage: {
      startMessage: "Привет выбери магазин: ",
      packMessage: "📦 Подготовь следуещее количество флаконов: \n",
      amountOrders: "📦 Количество заказов равно: ", 
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
        finishMessage: (orders) => `....🎉 🎉 🎉.... \n Упаковкa закончена!\n ✅ Ты собрал(а) ${orders} заказa! 👍 👍 👍`
    
    },
    
}