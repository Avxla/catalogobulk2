import { Router } from "express";

import authController from "./auth.controller.js";

const router = Router();

router.post(
    "/register",
    authController.registrar
);

router.post(
    "/login",
    authController.login
);

export default router;