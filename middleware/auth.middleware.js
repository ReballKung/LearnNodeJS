const jwt = require("jsonwebtoken");

const middleware = {
  AuthCheck: async function (req, res, next) {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      // console.log(token);
      const decoded = jwt.verify(token , '1111');
      req.auth = decoded;

      let {active} = decoded;

      if(active === 0) {
        res.status(400).send({
          status : 400 ,
          message : "Your user is not approve. Please contact Admin."
        });
      } else if (active === 1) {
          return next();
      }
      
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: "Failed to authenticate token",
      });
    }
  },
};

module.exports = { ...middleware };
