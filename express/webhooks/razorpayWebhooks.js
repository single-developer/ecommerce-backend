const router = require(`express`).Router();
const { capturePayment } = require("../controllers/webhookController");

router.post(`/capture-payment`, capturePayment);

module.exports = router;
