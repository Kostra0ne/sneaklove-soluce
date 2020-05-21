const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const userModel = require("./../models/User");


router.post("/signin", (req, res, next) => {
  const userInfos = req.body;
  console.log(userInfos);
  
  if (!userInfos.email || !userInfos.password) {
    req.flash("warning", "Attention, email et password sont requis !");
    res.redirect("/signin");
  }

  userModel
    .findOne({ email: userInfos.email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Identifiants incorrects");
        res.redirect("/signin");
      }

      const checkPassword = bcrypt.compareSync(
        userInfos.password,
        user.password
      );

      if (checkPassword === false) {
        req.flash("error", "Identifiants incorrects");
        res.redirect("/signin");
      }

      const { _doc: clone } = { ...user };
      delete clone.password;
      req.session.currentUser = clone;

      res.redirect("/prod-manage");
    })
    .catch(next);
});


router.post("/signup", (req, res, next) => {
  const user = req.body;

  if (!user.lastname || !user.firstname || !user.email || !user.password) {
    req.flash("warning", "Merci de remplir tous les champs requis.");
    res.redirect("/signup");
  } else {
    userModel
      .findOne({ email: user.email })
      .then((dbRes) => {
        if (dbRes) {
          req.flash("warning", "Désolé, cet email n'est pas disponible.");
          res.redirect("/signup");
        }
      })
      .catch(next);

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(user.password, salt);
    user.password = hashed;

    userModel
      .create(user)
      .then((dbRes) => {
        req.flash("success", "Inscription validée !");
        res.redirect("/signin");
      })
      .catch(next);
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => res.redirect("/signin"));
});

module.exports = router;
