import express from "express";
import userCtrl from "../controllers/user.ctrl";

const router = express.Router();

router.route("/users").post(userCtrl.create).get(userCtrl.list);
router
  .route("/users/:userId")
  .get(userCtrl.read)
  .patch(userCtrl.update)
  .delete(userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
