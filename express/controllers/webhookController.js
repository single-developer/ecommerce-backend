const supabase = require("../config/supabaseConfig");
const crypto = require(`crypto`);
const {
  orderPaidEventController,
} = require("./paymentEventsController/order.paid");

async function capturePayment(req, res, next) {
  try {
    const body = JSON.stringify(req.body);
    const signature = req.get(`X-Razorpay-Signature`);
    const { payload } = req.body;
    const event = req.body?.event;

    const expectedSignature = crypto
      .createHmac(`sha256`, process.env.WEBHOOK_KEY_SECRET)
      .update(body)
      .digest(`hex`);

    if (signature === expectedSignature) {
      if (event === `order.paid`) {
        const orderPaidRes = await orderPaidEventController(payload);
        console.log({ orderPaidRes });
      }
    } else {
      res.status(400).json({
        success: false,
        message: `Invalid Payment Signature`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
}

module.exports = { capturePayment };
