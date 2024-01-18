const instance = require(`../services/razorpayService`);

async function orderCreateController(req, res, next) {
  try {
    const { amount, current } = req.body;

    let options = {
      amount: amount || 100,
      currency: current || `INR`,
    };

    await instance.orders.create(options).then((paymentRes) => {
      return res.status(200).json({
        success: true,
        paymentRes,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

async function orderConfirmController(req, res, next) {
  try {
    const { orderId, signature } = req.query;

    const payment = await instance.orders.fetch(orderId);

    const isValidSignature = await instance.webhooks.verifyPaymentSignature(
      JSON.stringify(payment),
      signature,
      process.env.WEBHOOK_KEY_SECRET
    );

    return res.send(isValidSignature)

  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

async function getOrderController(req, res, next) {
  try {
    const { orderId } = req.body;

    await instance.orders.fetch(orderId).then((orderRes) => {
      return res.status(200).json({
        success: true,
        orderRes,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

module.exports = {
  orderCreateController,
  orderConfirmController,
  getOrderController,
};
