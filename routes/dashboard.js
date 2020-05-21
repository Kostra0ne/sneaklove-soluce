const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const sneakerService = require("../services/sneaker");
const tagService = require("../services/tag");
const uploader = require("./../config/cloudinary");
const protectRoute = require("./../middlewares/protectPrivateRoute");


router.get("/prod-add", protectRoute, (req, res) => {
  tagService
    .getAll()
    .then((tags) => {
      res.render("products_add", {
        tags,
        msg: req.session.msg,
        scripts: ["ajax_tag_form.js"],
      });
    })
    .catch((err) => console.log(err));
});

router.post("/prod-add", protectRoute, uploader.single("image"), (req, res, next) => {
  const { name, ref, size, description, category, price } = req.body;
  const newProduct = { name, ref, size, category, description, price };

  if (req.body.id_tags) newProduct.id_tags = [req.body.id_tags];

  if (req.file) {
    newProduct.image = req.file.secure_url;
  }

  sneakerService
    .create(newProduct)
    .then(() => {
      req.flash("success", "Yes!! A new sneaker was created");
      res.redirect("/prod-manage");
    })
    .catch(next);
});

router.get("/prod-manage", protectRoute, (req, res) => {
  sneakerService.getAll("collection").then((apiRes) => {
    res.render("products_manage", {
      sneakers: apiRes,
      scripts: ["ajax_dashboard_delete.js"],
    });
  });
});

router.get("/prod-edit/:id", protectRoute, (req, res) => {
  Promise.all([sneakerService.getOne(req.params.id), tagService.getAll()])
    .then((apiRes) => {
      res.render("product_edit", { sneaker: apiRes[0], tags: apiRes[1] });
    })
    .catch((apiErr) => next(apiErr));
});

router.post("/prod-edit/:id", protectRoute, uploader.single("image"), (req, res, next) => {
  const { name, ref, size, description, category, price, tags } = req.body;
  const updatedProduct = {
    name,
    ref,
    size,
    category,
    description,
    price,
    tags,
  };

  if (req.file) updatedProduct.image = req.file.secure_url;

  sneakerService
    .updateOne(req.params.id, updatedProduct)
    .then(() => {
      req.flash("success", "Yes!! Sneaker successfully updated");
      res.redirect("/prod-manage");
    })
    .catch(next);
});

router.get("/prod-delete/:id", (req, res, next) => {
  sneakerService
    .deleteOne(req.params.id)
    .then(() => {
      req.flash("success", "Yes!! Sneaker successfully deleted");
      res.redirect("/prod-manage");
    })
    .catch(next);
});


module.exports = router;
