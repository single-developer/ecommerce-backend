const {
  fullSettlementController,
  partialSettlementController,
} = require("../controllers/settlementController");

const router = require(`express`).Router();


router.post(`/full-settlement`, fullSettlementController);
router.post(`/partial-settlement`, partialSettlementController);

module.exports = router;
