const supabase = require(`../config/supabaseConfig`);
const { validateRequired } = require("../functions/validations");
const logger = require(`../functions/logger`);

async function createNewProduct(req, res, next) {
  const {
    productTitle,
    productImage,
    productPrice,
    productDescription,
    prodcutQuantity,
    productRating,
    productHeadline,
  } = req.body;

  const required = [
    `productTitle`,
    `productImage`,
    `productPrice`,
    `productDescription`,
    `prodcutQuantity`,
    `productRating`,
    `productHeadline`,
  ];

  const valid = validateRequired(required, req.body);

  if (valid) {
    return res.status(400).json({
      success: false,
      message: valid,
    });
  }

  try {
    const { data, error } = await supabase.from(`products`).upsert([
      {
        created_at: new Date().getTime(),
        productTitle,
        productImage,
        productPrice,
        productDescription,
        prodcutQuantity,
        productRating,
        productHeadline,
      },
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to create ${productTitle}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${productTitle} is successfully created.`,
    });
  } catch (error) {
    throw error;
  }
}

async function getAllProducts(req, res, next) {
  try {
    const { data, error } = await supabase.from(`products`).select(`*`);

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Something went wrong.`,
      });
    }

    data.map((m) => {
      m.created_at = new Date(m.created_at)
        .toISOString()
        .split(`T`)[0]
        .split(`-`)
        .reverse()
        .join(`-`);

      return m;
    });

    return res.status(200).json({
      success: true,
      products: data.length === 1 ? data[0] : data,
    });
  } catch (error) {
    throw error;
  }
}

async function getProduct(req, res, next) {
  if (!req.query.productId) {
    return res.status(400).json({
      success: false,
      message: `Product ID is required. `,
    });
  }

  try {
    const { data, error } = await supabase
      .from(`products`)
      .select(`*`)
      .eq(`productId`, req.query.productId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Something went wrong.`,
      });
    }

    data.map((m) => {
      m.created_at = new Date(m.created_at)
        .toISOString()
        .split(`T`)[0]
        .split(`-`)
        .reverse()
        .join(`-`);

      return m;
    });


    logger.userLogger.info(`Successfully data fetched...`);

    return res.status(200).json({
      success: true,
      products: data.length === 1 ? data[0] : data,
    });
  } catch (error) {
    throw error;
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await supabase
      .from(`products`)
      .select(`productId, productTitle`)
      .eq(`productId`, req.body.productId)
      .single();

    if (product.error) {
      return res.status(500).json({
        success: false,
        message: `Something went wrong.`,
      });
    }

    const { data, error } = await supabase
      .from(`products`)
      .update([req.body])
      .eq(`productId`, product.data?.productId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Something went wrong.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${product.data?.productTitle} is successfully updated`,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createNewProduct,
  getAllProducts,
  getProduct,
  updateProduct,
};
