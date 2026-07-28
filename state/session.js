const sessions = new Map();


const createSession = () => {
    return {
      sentMessages: [],
      sticking: {
        orders: [],
        currentPage: 0,
        itemsPerPage: 3,
        sentMessages: []
      },
      packaging: {
        orders: [],
        currentPage: 0,
        itemsPerPage: 3,
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