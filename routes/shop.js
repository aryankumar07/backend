const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const isAuthMw = require('../middliware/is_auth');

const { check } = require('express-validator');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthMw, shopController.getCart);

router.post('/cart', isAuthMw, shopController.postCart);

router.post('/cart-delete-item', isAuthMw, shopController.postCartDeleteProduct);

router.post('/create-order', isAuthMw, shopController.postOrder);

router.get('/orders', isAuthMw, shopController.getOrders);

router.get('/orders/:orderId',isAuthMw, shopController.getInvoice);

module.exports = router;
