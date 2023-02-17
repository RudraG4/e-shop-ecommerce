import UserDAO from "./UserDAO.js";
import ProductDAO from "./ProductDAO.js";

const addToBrowsingHistory = async (productId, userId) => {
  try {
    if (userId && productId) {
      const userInfo = await UserDAO.findUserById(userId);
      if (userInfo) {
        const browsingHistory = userInfo.browsingHistory || [];
        const index = browsingHistory.findIndex((pId) => pId === productId);
        if (index == -1) {
          browsingHistory.push(productId);
        }
        await UserDAO.updateUserById(userId, { browsingHistory });
        return { success: true };
      }
      return { error: "No user found" };
    }
    return { error: "Empty User ID or Product Id" };
  } catch (e) {
    console.error(`Unable to add productId to users browsing history: ${e}`);
  }
};

const getBrowsingHistory = async (userId) => {
  try {
    if (userId) {
      const userInfo = await UserDAO.findUserById(userId, [
        "_id",
        "browsingHistory",
      ]);
      if (userInfo) {
        if (userInfo["browsingHistory"]?.length) {
          return await ProductDAO.queryProductByIds(
            userInfo["browsingHistory"]
          );
        }
      }
    }
  } catch (e) {
    console.error(`Unable to query users browsing history: ${e}`);
  }
};

const clearBrowsingHistory = async (userId) => {
  try {
    if (userId) {
      const userInfo = await UserDAO.findUserById(userId);
      if (userInfo) {
        await UserDAO.updateUserById(userId, { browsingHistory: [] });
        return { success: true };
      }
    }
  } catch (e) {
    console.error(`Unable to clear users browsing history: ${e}`);
  }
};

export default {
  addToBrowsingHistory,
  getBrowsingHistory,
  clearBrowsingHistory,
};
