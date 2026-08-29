import { Router } from "express";

import proveedorController from "./proveedor.controller.js";

import auth from "../../middlewares/auth.js";
import rol from "../../middlewares/rol.js";

const router = Router();

router.get(
    "/",
    auth,
    proveedorController.listar
);

router.get(
    "/:id",
    auth,
    proveedorController.obtener
);

router.post(
    "/",
    auth,
    rol("admin"),
    proveedorController.crear
);

router.put(
    "/:id",
    auth,
    rol("admin"),
    proveedorController.actualizar
);

router.delete(
    "/:id",
    auth,
    rol("admin"),
    proveedorController.eliminar
);

export default router;