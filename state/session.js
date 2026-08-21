const sessions = new Map();


const createSession = () => {
    return {
      groupedOrders: null,
      amountOfOrders: null,
      activeMessageId: null,
      startedAt: null,
      shopName: null,
      sticking: {
        orders: [],
        currentPage: 0,
        itemsPerPage: 3,
        sentMessages: []
      },
      packaging: {
        orders: [],
        currentPage: 0,
        itemsPerPage: 5,
        sentMessages: []
      }
    }
}

export const getSession = (chatId) => {
    if (!sessions.has(chatId)) {
        sessions.set(chatId, createSession())
    }
    return sessions.get(chatId);
};

export const deleteSession = (chatId) => {
  sessions.delete(chatId);
};