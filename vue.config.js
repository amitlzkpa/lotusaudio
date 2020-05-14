require('dotenv').config();

const PORT = process.env.PORT || 8080;

module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: `http://localhost:${PORT}/`,
        logLevel: "debug"
      }
    }
  }
};