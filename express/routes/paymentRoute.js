const router = require(`express`).Router();
const {
  createCustomerController,
  orderCreateController,
  paymentLinkController,
  qrCodePaymentController,
  getOrderController,
} = require("../controllers/paymentController");
const { restrictToAccess } = require("../middlewares/authJWT");

router.post(`/create-customer`, restrictToAccess, createCustomerController);
router.post(`/order-create`, orderCreateController);
router.post(`/payment-link`, paymentLinkController);
router.post(`/qrCode-payment`, qrCodePaymentController);
router.post(`/get-order`, getOrderController);
// router.get(`/refund`, refundController);

module.exports = router;
