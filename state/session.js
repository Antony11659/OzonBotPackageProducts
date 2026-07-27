const sessions = new Map();


const createSession = () => {
    return {
      sentMessages: [],
      stickingOrders: [],
      currentPage: 0,
      itemsPerPage: 3
    }
}

export const getSession = (chatId) => {
    if (!sessions.has(chatId)) {
        sessions.set(chatId, createSession())
    }
    return sessions.get(chatId);
}