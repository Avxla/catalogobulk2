import { Router } from "express";
import importController from "./import.controller.js";
import upload from "../../middlewares/upload.js";
import auth from "../../middlewares/auth.js";
import rol from "../../middlewares/rol.js";

// Diagnóstico rápido en consola: si alguno dice "undefined", ese es el del problema
console.log("--- DIAGNÓSTICO DE RUTAS DE IMPORTACIÓN ---");
console.log("auth es:", typeof auth);
console.log("rol('admin') es:", typeof rol("admin"));
console.log("upload.single es:", typeof upload?.single);
console.log("importController.crear es:", typeof importController?.crear);
console.log("-------------------------------------------");

const router = Router();

router.post(
    "/",
    auth,
    
    upload.single("file"),
    importController.crear
);

router.get(
    "/",
    auth,
    
    importController.listar
);

router.get(
    "/:id",
    auth,
    importController.obtener
);

export default router;