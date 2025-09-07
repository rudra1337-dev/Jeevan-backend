// This will store blacklisted tokens until server restarts
const tokenBlacklist = [];

module.exports = {
  tokenBlacklist,
  addTokenToBlacklist: (token) => {
    tokenBlacklist.push(token);
  },
  isTokenBlacklisted: (token) => {
    return tokenBlacklist.includes(token);
  }
};