const instance = require("../services/razorpayService");

async function fullSettlementController(req, res, next) {}

async function partialSettlementController(req, res, next) {
  try {
    await instance.settlements.createOndemandSettlement({
      amount: 100000,
    }).then((settlementRes) => {
        
        return res.status(200).json({
            success : true,
            settlementRes
        })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: `Internal Server Error.`,
    });
  }
}

module.exports = { fullSettlementController, partialSettlementController };
