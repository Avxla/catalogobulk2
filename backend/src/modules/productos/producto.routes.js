import { Router } from "express";

import productoController from "./producto.controller.js";

import auth from "../../middlewares/auth.js";
import rol from "../../middlewares/rol.js";

const router = Router();

router.get(
    "/",
    auth,
    productoController.listar
);

router.get(
    "/stats",
    auth,
    productoController.estadisticas
);

router.get(
    "/:id",
    auth,
    productoController.obtener
);

router.post(
    "/",
    auth,
    rol("admin"),
    productoController.crear
);

router.put(
    "/:id",
    auth,
    rol("admin"),
    productoController.actualizar
);

router.delete(
    "/:id",
    auth,
    rol("admin"),
    productoController.eliminar
);

export default router;