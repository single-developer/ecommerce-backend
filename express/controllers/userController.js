const supabase = require(`../config/supabaseConfig`);
const bcrypt = require(`bcrypt`);
const sendEmail = require(`../functions/sendMail`);
const jwt = require(`jsonwebtoken`);

async function registrationController(req, res, next) {
  const { email, password, role, name } = req.body;

  let validation = [`email`, `password`, `role`, `name`];

  validation.forEach((ele) => {
    if (!req.body[ele]) {
      return res.status(500).json({
        success: false,
        error: `${ele} is required.`,
      });
    }
  });

  try {
    const exisitingUser = await supabase
      .from(`users`)
      .select(`username`)
      .eq(`username`, email);

    if (exisitingUser.data.length !== 0) {
      return res.status(400).json({
        success: false,
        message: `${email} user already exists.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await supabase
      .from(`users`)
      .upsert([
        {
          created_at: new Date().getTime(),
          username: email,
          password: hashedPassword,
          isActive: role === "admin" ? true : false,
          role,
          avatarUrl: null,
          name,
        },
      ])
      .then(async (createdUser) => {
        if (createdUser.error) {
          return res.status(500).json({
            success: false,
            error:
              createdUser?.error?.message ||
              createdUser?.error ||
              `Internal Server Error.`,
          });
        }

        const newUser = await supabase
          .from(`users`)
          .select(`id, username`)
          .eq(`username`, email)
          .single();

        const token = jwt.sign(
          { id: newUser.data?.id, username: newUser.data?.username },
          process.env.JWT_SECRET_KEY
        );

        let mail = {
          to: email,
          subject: `Welcome to "E-Commerce" - Confirm Your Account Registration`,
          content: `${token}`,
        };

        await sendEmail(mail)
          .then((mailRes) => {
            if (mailRes) {
              res.status(200).json({
                success: true,
                message: `We have sent a verification link. Please confirm your email address.`,
              });
            }
          })
          .catch((error) => {
            throw error;
          });
      });
  } catch (error) {
    throw error;
  }
}

async function loginController(req, res, next) {
  const { email, password } = req.body;

  const validation = [`email`, `password`];

  validation.forEach((ele) => {
    if (!req.body[ele]) {
      return res.status(400).json({
        success: false,
        error: `${ele} is required`,
      });
    }
  });

  try {
    const exisitingUser = supabase
      .from(`users`)
      .select(`username, password, id, isActive`)
      .eq(`username`, email)
      .single();

    const { data, error } = await exisitingUser;

    if (error) {
      return res.status(500).json({
        success: false,
        message: `${email} user is not found.`,
      });
    }

    const matchPassword = await bcrypt.compare(password, data.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        error: `You have entered wrong password.`,
      });
    }

    if (!data.isActive) {
      return res.status(400).json({
        success: false,
        message: `InActive Account. Please verify your account or contact to us +91 701107****`,
      });
    }

    const token = jwt.sign(
      { id: data?.id, username: data?.username },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    throw error;
  }
}

async function getAllUsers(req, res, next) {
  try {
    const { data, error } = await supabase.from(`users`).select(
      `
			id, username, name, role, isActive, created_at
		`
    );

    if (error) {
      return res.status(400).json({
        success: false,
        error: error?.message || error || `Something went wrong.`,
      });
    }

    data.map((m) => {
      m.created_at = new Date(m.created_at)
        .toISOString()
        .split(`T`)[0]
        .split(`-`)
        .reverse()
        .join(`-`);
    });

    return res.status(200).json({
      success: true,
      totalUsers: data.length,
      users: data,
    });
  } catch (error) {
    throw error;
  }
}

async function getUser(req, res, next) {
  try {
    const { data, error } = await supabase
      .from(`users`)
      .select(
        `	
			id, username, name, role, isActive, created_at
		`
      )
      .eq(`id`, req.user.id);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error?.message || error || `Something went wrong.`,
      });
    }

    data.map((m) => {
      m.created_at = new Date(m.created_at)
        .toISOString()
        .split(`T`)[0]
        .split(`-`)
        .reverse()
        .join(`-`);
    });

    return res.status(200).json({
      success: true,
      user: data[0],
    });
  } catch (error) {
    throw error;
  }
}

async function activateAccount(req, res, next) {
  const { id, username } = req.user;

  try {
    const { data, error } = await supabase
      .from(`users`)
      .select(`id, username`)
      .eq(`id`, id)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid token`,
      });
    }

    if (data.id === id && data.username === username) {
      await supabase
        .from(`users`)
        .update([
          {
            isActive: true,
          },
        ])
        .eq(`id`, id)
        .then((activateRes) => {
          return res.status(200).json({
            success: true,
            message: `${username} has been activate. Thank you :)`,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  } catch (error) {
    throw error;
  }
}

async function deActivateAccount(req, res, next) {
  const { id, username } = req.user;

  try {
    const { data, error } = await supabase
      .from(`users`)
      .select(`id, username`)
      .eq(`id`, id)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid token`,
      });
    }

    if (data.id === id && data.username === username) {
      await supabase
        .from(`users`)
        .update([
          {
            isActive: false,
          },
        ])
        .eq(`id`, id)
        .then((activateRes) => {
          return res.status(200).json({
            success: true,
            message: `${username} has been deactivate. Thank you :)`,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registrationController,
  loginController,
  getAllUsers,
  getUser,
  activateAccount,
  deActivateAccount,
};
