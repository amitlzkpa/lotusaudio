const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");




const jsdocOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "VueStarter API Docs",
      version: "1.0.0",
    }
  },
  apis: [
    "server/**/*.js"
  ]
};

const swaggerDocs = swaggerJsdoc(jsdocOptions);



const swaggerOptions = { 
  customCss: '.swagger-ui .topbar { display: none }',
  customJs: '/swagger/customization.js'
};

function setup(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));
}




module.exports = {
  setup
}