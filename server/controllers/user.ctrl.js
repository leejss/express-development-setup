import User from "../models/user.model";
import Joi from "joi";

const create = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: result.error,
    });
  }

  const { name, email, password } = req.body;
  try {
    const exists = await User.findByEmail(email);
    if (exists) {
      return res.status(409).json({
        error: "Email is not valid",
      });
    }
    const user = new User({
      name,
      email,
    });
    await user.encryptPassword(password);
    await user.save();
    return res.status(200).json(user.serialize());

    // token 발급
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        error: "No Users",
      });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const userByID = async (req, res, next, id) => {
  // id를 조회하여 req객체에 user데이터를 저장하는 미들웨어
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        error: "User Not Found",
      });
    }
    req.profile = user.serialize();
    next();
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const read = (req, res) => {
  const user = req.profile;
  return res.status(200).json(user);
};

const update = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: result.error,
    });
  }

  const updatedData = req.body;
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).exec();
    if (!user) {
      return res.status(404).end();
    }
    return res.status(200).json(user.serialize());
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const remove = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

export default { create, list, userByID, read, update, remove };
