import { Router } from "express";

import productoController from "./producto.controller.js";

import auth from "../../middlewares/auth.js";
import rol from "../../middlewares/rol.js";

const router = Router();

router.get(
    "/",
    productoController.listar
);

router.get(
    "/stats",
    productoController.estadisticas
);

router.get(
    "/:id",
    productoController.obtener
);

router.post(
    "/",
    productoController.crear
);

router.put(
    "/:id",
    productoController.actualizar
);

router.delete(
    "/:id",
    productoController.eliminar
);

export default router;