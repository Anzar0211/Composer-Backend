"use strict";
const router = require("express").Router();
const controller = require("../../controllers/items");
const {
    search,
    get,
    getAllProducts,
    insert,
    insertMultiple,
    deleteProduct,
    edit,
} = require("../../db/queries/query");
const { message } = require("../../server");



console.log('In Routers/item');

router.use("/", controller);

router.get("/getById/:id", async (req, res) => {
    return res.json({message:"hello world"})
//   try {
//     const { id } = req.params;
//     const product = await get(id);
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching product" });
//   }
});


module.exports = router;
