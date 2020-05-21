const express = require("express");
const router = new express.Router();
const sneakerService = require("../services/sneaker");
const tagService = require("../services/tag");

router.get(["/", "/home"], (req, res) => {
  res.render("index");
});

router.get("/sneakers/:cat", (req, res, next) => {
  Promise.all([sneakerService.getAll(req.params.cat), tagService.getAll()])
    .then((apiRes) =>
      res.render("products", {
        category: req.params.cat,
        scripts: ["ajax_tag_filter.js"],
        sneakers: apiRes[0],
        tags: apiRes[1],
      })
    )
    .catch(next);
});

router.get("/one-product/:id", (req, res, next) => {
  sneakerService
    .getOne(req.params.id)
    .then((sneaker) => res.render("one_product", { sneaker }))
    .catch(next);
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin", { msg: req.session.msg });
});

module.exports = router;
