const express = require(`express`);
require(`dotenv`).config();
const cookieParser = require(`cookie-parser`);
const app = express();
const cors = require(`cors`);
const port = process.env.PORT || 3000;

const { restrictToAccess } = require("./middlewares/authJWT");
const dashboardRoute = require(`./routes/dashboardRoute`);
const productRoute = require(`./routes/productRoute`);
const userRoute = require(`./routes/userRoute`);
const paymentRoute = require(`./routes/paymentRoute`);
const webhookRoute = require(`./webhooks/razorpayWebhooks`);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use(express.static(`uploads`));

app.get(`/`, (req, res, next) => {
  res.send({ status: `Ok` });
});
app.use(`/api`, userRoute);
app.use(`/api/dashboard`, restrictToAccess, dashboardRoute);
app.use(`/api/products`, productRoute);
app.use(`/api/payment`, paymentRoute);
app.use(`/api/webhook`, webhookRoute);

app.listen(port, () => {
  console.log(`Starting... ${port}`);
});
