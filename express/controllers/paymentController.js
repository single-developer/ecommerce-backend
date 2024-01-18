const instance = require(`../services/razorpayService`);

async function createCustomerController(req, res, next) {
  try {
    const { name, username } = req.user;

    console.log(req.user);

    await instance.customers.create(
      {
        name: name,
        email: username,
      },
      (err, customer) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: `Customer not created.`,
          });
        }

        return res.status(200).json({
          success: true,
          customer,
          message: `Customer created successfully.`,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

async function orderCreateController(req, res, next) {
  try {
    const { amount, current } = req.body;

    let options = {
      amount: amount || 100,
      currency: current || `INR`,
    };

    await instance.orders.create(options).then((orderRes) => {
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

async function paymentLinkController(req, res, next) {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount || 100,
      currency: `INR`,
    };

    await instance.paymentLink.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        });
      }

      const paymentLink = order?.short_url;
      console.log({ paymentLink });

      return res.status(200).json({
        success: true,
        paymentLink: order,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

async function qrCodePaymentController(req, res, next) {
  try {
    await instance.qrCode
      .create({
        type: "upi_qr",
        name: "Store Front Display",
        usage: "single_use",
        fixed_amount: true,
        payment_amount: 300,
        description: "For Store 1",
        customer_id: "cust_HKsR5se84c5LTO",
        close_by: Math.floor(
          new Date(new Date().getTime() + 15 * 60 * 1000).getTime() / 1000
        ),
        notes: {
          purpose: "Test UPI QR Code notes",
        },
      })
      .then((qrRes) => {
        console.log(qrRes);
      });
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
  createCustomerController,
  orderCreateController,
  paymentLinkController,
  qrCodePaymentController,
  getOrderController,
};
