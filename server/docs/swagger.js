import swaggerAutogen from "swagger-autogen";

const options = {
  openapi: "OpenAPI 3", // Enable/Disable OpenAPI. By default is null
  language: "en-US", // Change response language. By default is 'en-US'
  disableLogs: false, // Enable/Disable logs. By default is false
  autoHeaders: false, // Enable/Disable automatic headers capture. By default is true
  autoQuery: false, // Enable/Disable automatic query capture. By default is true
  autoBody: false, // Enable/Disable automatic body capture. By default is true
};

const doc = {
  info: {
    version: "1.0.0", // by default: '1.0.0'
    title: "EShop Rest Apis", // by default: 'REST API'
    description: "API for Eshop ecommerce website", // by default: ''
    contact: {
      name: "-",
      email: "-",
    },
  },
  host: "localhost:8080", // by default: 'localhost:3000'
  basePath: "/", // by default: '/'
  schemes: ["http", "https"], // by default: ['http']
  consumes: ["application/json"], // by default: ['application/json']
  produces: ["application/json"], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: "Authorization", // Tag name
      description: "Authentication related apis", // Tag description
    },
    {
      name: "Cart",
      description: "Cart related apis",
    },
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {
    // helathResponse: {
    //   code: msg.response.CAG001.code,
    //   message: msg.response.CAG001.message,
    // },
    // 'errorResponse.400': {
    //   code: msg.response.CAGE002.code,
    //   message: msg.response.CAGE002.message,
    // },
    // 'errorResponse.403': {
    //   code: msg.response.CAGE001.code,
    //   message: msg.response.CAGE001.message,
    // },
    // 'errorResponse.404': {
    //   "code": "404",
    //   "message": "Not found",
    // },
    // 'errorResponse.500': {
    //   code: msg.response.CAGE003.code,
    //   message: msg.response.CAGE003.message,
    // }
  },
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = [
  "../src/EShopAPI.js",
  "../src/routes/auth.route.js",
  "../src/routes/cart.route.js",
];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
swaggerAutogen(options)(outputFile, endpointsFiles, doc);
