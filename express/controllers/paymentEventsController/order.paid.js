const supabase = require("../../config/supabaseConfig");

async function orderPaidEventController(payload) {
  return new Promise(async (resolved, reject) => {
    let paymentDetails = {
      created_at: Date.now(),
      amount: payload?.payment?.entity?.amount / 100,
      currency: payload?.payment?.entity?.currency,
      orderId: payload?.order?.entity?.id,
      status: payload?.order?.entity?.status,
    };  

    try {
      await supabase
        .from(`transactions`)
        .insert([paymentDetails])
        .then((insertRes) => {
          return resolved(true);
        });
    } catch (error) {
      return reject(error);
    }
  });
}

module.exports = { orderPaidEventController };
