const router = require(`express`).Router();
const sendEmail = require("../functions/sendMail");

router.get(`/`, (req, res, next) => {
  res.send(true)
})



module.exports = router;
