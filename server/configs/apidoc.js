const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");




const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "vuestarter API docs",
      version: "1.0.0",
    }
  },
  apis: [
    "server/**/*.js"
  ]
};

const swaggerDocs = swaggerJsdoc(options);



function setup(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
}




module.exports = {
  setup
}