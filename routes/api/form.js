const express = require("express");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const router = express.Router();
const { check, validationResult } = require("express-validator");
var bcrypt = require("bcrypt");
const { set } = require("mongoose");
const auth = require("../../middleware/auth");

// @route  GET /user
// @desc   LIST user
// @access Private
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    res.status(500).send({ error: "Server Error" });
  }
});

// @route  GET /user/:email
// @desc   DETAIL user
// @access Public
router.get("/:email", [], async (req, res, next) => {
  try {
    let param_email = req.params["email"];
    const user = await User.findOne({ email: param_email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server Error" });
  }
});

// @route  POST /user
// @desc   CREATE user
// @access Public
router.post(
  "/",
  [
    check("email", "email is not valid").isEmail(),
    check("name", "name is required").not().isEmpty(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    try {
      let { name, email, password, is_active, is_admin } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        let user = new User({ name, email, password, is_active, is_admin });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // const payload = {
        //     user: {
        //       id: user.id
        //     }
        //   }
        if (user.id) {
          res.json(user);
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: "Server Error" });
    }
  }
);

// @route  PATCH /user/:email
// @desc   PARTIAL EDIT user
// @access Public
router.patch(
  "/:email",
  [check("email", "email is not valid").isEmail()],
  async (req, res, next) => {
    try {
      let param_email = req.params["email"];
      let { name, email, password, is_active, is_admin } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const update = req.body;
      if (password != undefined && password != null && password != "") {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findOneAndUpdate(
        { email: param_email },
        { $set: update },
        { new: true }
      );
      console.log(user, req.body);
      if (password == undefined || password == null || password == "") {
        if (user) {
          res.json(user);
        } else {
          res.status(404).send({ error: "Not Found" });
        }
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ error: "server error" });
    }
  }
);

// @route  PUT /user/:email
// @desc   EDIT user
// @access Public
router.put(
  "/:email",
  [
    check("email", "email is not valid").isEmail(),
    check("name", "name is required").not().isEmpty(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    try {
      let param_email = req.params["email"];
      let { name, email, password, is_active, is_admin } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const update = { name, email, password, is_active, is_admin };
      const user = await User.findOneAndUpdate({ email: param_email }, update, {
        new: true,
      });
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ error: "server error" });
    }
  }
);

// @route  DELETE /user/:id
// @desc   DELETE user
// @access Public
router.delete("/:userid", async (req, res, next) => {
  try {
    const param_id = req.params.userid;
    const user = await User.findOneAndRemove({ _id: param_id });
    await Profile.findOneAndRemove({ user: param_id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

module.exports = router;
