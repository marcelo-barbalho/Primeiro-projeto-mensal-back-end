const express = require("express");
const User = require("../../models/user");
const router = express.Router();
const { check, validationResult } = require("express-validator");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route  POST /auth
// @desc   AUTHENTICATE USER & GET TOKEN
// @access Public
router.post(
  "/",
  [
    check("email", "email is not valid").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).select(
        "id password email name is_active is_admin"
      );
      if (!user) {
        res.status(404).json({ Errors: [{ msg: "User do not exist" }] });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ Errors: [{ msg: "Wrong password" }] });
        } else {
          if (user.is_active == false) {
            return res
              .status(403)
              .json({ errors: [{ msg: "user is not active" }] });
          }
          const payload = {
            user: {
              id: user.id,
              name: user.name,
              is_active: user.is_active,
              is_admin: user.is_admin,
            },
          };

          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: "4 days" },
            (error, token) => {
              if (error) throw error;
              payload.token = token;
              res.json(payload);
            }
          );
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
module.exports = router;
