## Hey hackers !

Good news : Your team has been selected by our final client !

Your mission is to create a fullstack client-server CRUD application !!!

Our client demands an online shop specialized in sneakers.

Thankfully, our lead designer has already done a big part of the job.

So you won't have to deal that much with HTML/CSS ( Ahhh... this is perfect ; )

---

## You'll find the mission details below

- all sneakers are fetched from a mongo database

- the final users must be able to signup and signin

- logged in users are able to create new products

- logged in users are able to update a product

- logged in users are able to delete some products

- don't mess up the design

---

## Warning

- A lazy programer made some mistakes in the source code, you may have to find/fix the bugs !

---

## Shop pages :

- collection : display all products
- kids : display only kids products
- women : display only women products
- men : display only women products

(see bonus below)

---

## DB Schemas

- User {  
  name: String,  
  lastname: String,  
  email: String,  
  password: String  
  }  

- Sneaker {  
  name: String,  
  ref: String,  
  size: Number,  
  description: String,  
  price: Number,  
  category: String [men, women, kids],  
  id_tags: [ObjectId]  
  }

- Tags {  
  label: String  
  }  

---

## .env infos

- PORT=
- MONGO_URI=
- CLOUDINARY_NAME=
- CLOUDINARY_KEY=
- CLOUDINARY_SECRET=
- SESSION_SECRET=

---

## Delivery

Each team will deliver their code on a github repo
Before wednesday 26/05/2020 00h00
Code delivered or modified after the due date will get malus points

---

## Bonuses

- 1 make the shop responsive with flex and media-queries

- 2 add some custom categories @ /prod-add

- 3 code the products filters using the AJAX method

---

## Hardcore bonus

- 4 Add a shopcart feature :D
