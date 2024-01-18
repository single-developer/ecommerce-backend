const instance = require("../services/razorpayService");
const crypto = require(`crypto`);

async function capturePayment(req, res, next) {
  try {
    const { payload } = req.body;
    const signature = req.get(`X-Razorpay-Signature`);

    const orderId = payload?.payment_link?.entity?.order_id;
    const order = await instance.orders.fetch(orderId);

    console.log({ order });

    const isValidSignature = await instance.webhooks.verify(
      JSON.stringify(payload),
      signature,
      process.env.WEBHOOK_KEY_SECRET
    );

    console.log({ isValidSignature });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

module.exports = { capturePayment };
