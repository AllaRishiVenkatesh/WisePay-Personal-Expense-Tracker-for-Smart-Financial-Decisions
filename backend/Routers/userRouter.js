import express from 'express';
import { changeNameController, changePasswordController, forgotPasswordController, loginControllers, registerControllers, setAvatarController } from '../controllers/userController.js';

const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/setAvatar/:id").post(setAvatarController);

router.route("/changeName/:id").post(changeNameController);

router.route("/changePassword/:id").post(changePasswordController);

router.route("/forgotPassword").post(forgotPasswordController);

export default router;
