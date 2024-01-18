const router = require(`express`).Router();
const {
  orderCreateController,
  orderConfirmController,
  getOrderController,
} = require("../controllers/paymentController");

router.post(`/order-create`, orderCreateController);
router.get(`/order-confirm`, orderConfirmController);
router.post(`/get-order`, getOrderController);
// router.get(`/refund`, refundController);

module.exports = router;
