import { Router } from "express";
import proveedorController from "./proveedor.controller.js";

const router = Router();

router.get(
    "/",
    proveedorController.listar
);

router.get(
    "/:id",
    proveedorController.obtener
);

router.post(
    "/",
    proveedorController.crear
);

router.put(
    "/:id",
    proveedorController.actualizar
);

router.delete(
    "/:id",
    proveedorController.eliminar
);

export default router;