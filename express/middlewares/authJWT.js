const jwt = require(`jsonwebtoken`);
const supabase = require("../config/supabaseConfig");

async function restrictToAccess(req, res, next) {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          res.json({
            success: false,
            message: `Access denied. Please provide accesss token.`,
          });
        }

        const { data, error } = await supabase
          .from(`users`)
          .select(`id, username, name`)
          .eq(`id`, decoded?.id);

        req.user = data[0];
        if (data.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Access denied. Please provide accesss token.`,
          });
        }

        next();
      }
    );
  } else {
    res.json({
      success: false,
      message: `Access denied. Please provide accesss token.`,
    });
  }
}

module.exports = { restrictToAccess };
