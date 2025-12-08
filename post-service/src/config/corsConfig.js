const logger = require("../utils/logger");
const cors = require("cors");

const corsConfiguration = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrgins = [
        "http://localhost:3000", // API Gateway
        "http://localhost:3004", // Post Service (self)
        "http://localhost:3001", // Identity Service
        "http://localhost:3002", // profile  services
        "http://localhost:3003", // media Service
      ];
      if (!origin || allowedOrgins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods:["GET","POST"],
    preflightContinue:true,
    optionsSuccessStatus:204,
    maxAge:3600,
    allowedHeaders:["Content-Type","Authorization","x-user-id"],
    exposedHeaders:["X-Total-Count","Content-Range"],
    
  });
};
module.exports = { corsConfiguration };
