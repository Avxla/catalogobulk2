import express from "express";

import categoriaController from "./categoria.controller.js";

const router = express.Router();

router.get(
    "/",
    categoriaController.listar
);

router.get(
    "/:id",
    categoriaController.obtenerPorId
);

router.post(
    "/",
    categoriaController.crear
);

router.put(
    "/:id",
    categoriaController.actualizar
);

router.delete(
    "/:id",
    categoriaController.eliminar
);

export default router;