const router = require(`express`).Router();
const { capturePayment } = require("../controllers/webhookController");
const { restrictToAccess } = require("../middlewares/authJWT");

router.post(`/capture-payment`, capturePayment);

module.exports = router;