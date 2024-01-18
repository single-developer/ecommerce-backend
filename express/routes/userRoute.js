const router = require(`express`).Router();
const {
  registrationController,
  loginController,
  getAllUsers,
  getUser,
  activateAccount,
  deActivateAccount,
} = require("../controllers/userController");
const { restrictToAccess } = require("../middlewares/authJWT");

router.post(`/registration`, registrationController);
router.post(`/login`, loginController);
router.post(`/activateAccount`, restrictToAccess, activateAccount);
router.post(`/deActivateAccount`, restrictToAccess, deActivateAccount);
router.get(`/getAllUsers`, restrictToAccess, getAllUsers);
router.get(`/getUser`, restrictToAccess, getUser);

module.exports = router;
