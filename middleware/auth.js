const jwt = require("jsonwebtoken");
const config = require("config");
const map_router = require("../service/map_router");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      }
      console.log("decoded");
      req.user = decoded.user;
      map = map_router(req.baseUrl, decoded.user);
      if (map.status == 200) {
        next();
      } else {
        return res.status(map.status).json({ msg: map.msg });
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
