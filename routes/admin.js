const path = require('path');

const express = require('express');

const isAuthMw = require('../middliware/is_auth');

const adminController = require('../controllers/admin');

const { check } = require('express-validator');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuthMw , adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuthMw, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', 
isAuthMw,
 check('title')
 .isAlphanumeric()
 .isLength({
    min:3,
 }),
 check('imageUrl')
 .isURL(),
 check('description')
 .isLength({
    min:5
 }),
 adminController.postAddProduct
 );

router.get('/edit-product/:productId', isAuthMw, adminController.getEditProduct);

router.post('/edit-product', isAuthMw, adminController.postEditProduct);

router.post('/delete-product',isAuthMw, adminController.postDeleteProduct);

module.exports = router;
