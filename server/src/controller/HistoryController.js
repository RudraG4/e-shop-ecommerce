import BrowsingHistoryDAO from "../dao/BrowsingHistoryDAO.js";

const getBrowsingHistory = async (request, response) => {
  try {
    const { user } = request;
    if (user && user.userId) {
      const history = await BrowsingHistoryDAO.getBrowsingHistory(user.userId);
      if (history) {
        const body = {
          success: true,
          results: history,
          total: history.length,
        };
        return response.status(200).json(body);
      }
      return response.status(200).json({
        success: true,
        results: [],
        total: 0,
      });
    }
    return response.status(200).json({
      error: "No user found",
    });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
};

export default {
  getBrowsingHistory,
};
