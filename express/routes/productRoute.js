const {
  createNewProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} = require("../controllers/productController");
const { restrictToAccess } = require("../middlewares/authJWT");

const router = require(`express`).Router();

router.post(`/create-new-product`, createNewProduct);
router.get(`/get-all-product`, restrictToAccess, getAllProducts);
router.get(`/get-product`, restrictToAccess, getProduct);
router.patch(`/update-product`, restrictToAccess, updateProduct);

module.exports = router;
