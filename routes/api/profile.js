const express = require("express");
const Profile = require("../../models/profile");
const User = require("../../models/user");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

// @route    GET /profile/:userId
// @desc     DETAIL profile
// @access   Private
router.get("/:userId", [], async (req, res, next) => {
  try {
    const id = req.params.userId;
    const profile = await Profile.findOne({ user: id });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).send({ Error: "Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

// @route    GET /profile/
// @desc     DETAIL all profiles
// @access   Private
// router.get("/", [], auth, async (req, res, next) => {
//   try {
//     const profile = await Profile.find();
//     if (profile) {
//       res.json(profile);
//     } else {
//       res.status(404).send({ Error: "Not Found" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({ error: "Server Error" });
//   }
// });

router.get("/", async (req, res, next) => {
  try {
    let profiles = null;
    query = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (key.includes("formatsPlayed")) {
        query[key] = { $exists: true };
      } else if (key == "have") {
        query[key] = { $in: value.split(",") };
      } else {
        query[key] = value;
      }
    }
    profiles = await Profile.find(query);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server Error" });
  }
});

// @route    POST /profile/
// @desc     CREATE profile
// @access   Public
router.post("/", [], async (req, res, next) => {
  try {
    let {
      user,
      playingSince,
      dci,
      formatsPlayed,
      onlyBuying,
      onlyTrading,
      have,
      want,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      let uModel = await User.findOne({ _id: user });
      console.log(uModel);
      if (user) {
        let pModel = await Profile.findOne({ user: uModel.id });
        if (pModel) {
          res.status(400).send({ error: "profile already exist" });
        } else {
          let profile = new Profile({
            user,
            playingSince,
            dci,
            formatsPlayed,
            onlyBuying,
            onlyTrading,
            have,
            want,
          });

          await profile.save();
          if (profile.id) {
            res.json(profile);
          }
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

// @route   PATCH /profile/
// @desc     EDIT profile
// @access   Public

router.patch("/:id", async (req, res, next) => {
  try {
    const param_id = req.params.id;
    let {
      user,
      playingSince,
      dci,
      formatsPlayed,
      onlyBuying,
      onlyTrading,
      have,
      want,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const update = req.body;

    const prof = await Profile.findOneAndUpdate(
      { user: param_id },
      { $set: update },
      { new: true }
    );
    if (prof) {
      res.json(prof);
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "server error" });
  }
});

// @route  DELETE /prfile/:id
// @desc   DELETE profile
// @access Public
router.delete("/:id", async (req, res, next) => {
  try {
    const param_id = req.params.id;
    const delProf = await Profile.findOneAndRemove({ user: param_id });
    if (delProf) {
      res.json(delProf);
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

module.exports = router;
