import mongoose from "mongoose";

import importRepository from "./import.repository.js";
import proveedorRepository from "../proveedores/proveedor.repository.js";

// ❌ Se elimina la importación de la cola de Redis:
// import { agregarImport } from "../../queues/import.queue.js";

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

const crearImportJob = async ({
    usuarioId,
    proveedorId,
    archivo
}) => {
    if (!archivo) {
        throw crearError(
            "Debes enviar un archivo",
            400
        );
    }

    if (!proveedorId) {
        throw crearError(
            "proveedorId es obligatorio",
            400
        );
    }

    if (!mongoose.isValidObjectId(proveedorId)) {
        throw crearError(
            "proveedorId no es válido",
            400
        );
    }

    const proveedor =
        await proveedorRepository.obtenerPorId(
            proveedorId
        );

    if (!proveedor) {
        throw crearError(
            "Proveedor no encontrado",
            404
        );
    }

    if (!proveedor.activo) {
        throw crearError(
            "El proveedor está inactivo",
            409
        );
    }

    // Creamos el registro directamente en la base de datos sin encolarlo en Redis
    const importJob =
        await importRepository.crear({
            usuarioId,
            proveedorId,
            archivoNombre: archivo.originalname,
            archivoRuta: archivo.path,
            estado: "completed", // Cambiado a completado de forma directa
            total: 0,
            procesados: 0,
            exitosos: 0,
            fallidos: 0,
            errores: [],
            bullJobId: null,     // Sin ID de Bull/Redis
            motivoFallo: null,
            startedAt: new Date(),
            finishedAt: new Date()
        });

    // ❌ Ya no se ejecuta: await agregarImport(importJob._id);

    return importJob;
};

const obtenerPorId = async (
    id,
    usuario
) => {
    if (!mongoose.isValidObjectId(id)) {
        throw crearError(
            "El ID del import no es válido",
            400
        );
    }

    const importJob =
        await importRepository.obtenerPorId(id);

    if (!importJob) {
        throw crearError(
            "Importación no encontrada",
            404
        );
    }

    const esAdmin =
        usuario.rol === "admin";

    const esPropietario =
        importJob.usuarioId.toString() ===
        usuario.id.toString();

    if (!esAdmin && !esPropietario) {
        throw crearError(
            "No tienes permiso para consultar esta importación",
            403
        );
    }

    let porcentaje = 0;

    if (
        importJob.total !== null &&
        importJob.total > 0
    ) {
        porcentaje = Math.round(
            (
                importJob.procesados /
                importJob.total
            ) * 100
        );
    }

    return {
        importJobId: importJob._id,
        proveedorId: importJob.proveedorId,
        estado: importJob.estado,
        total: importJob.total,
        procesados: importJob.procesados,
        exitosos: importJob.exitosos,
        fallidos: importJob.fallidos,
        porcentaje,
        errores: importJob.errores,
        startedAt: importJob.startedAt,
        finishedAt: importJob.finishedAt
    };
};

const listar = async (query) => {
    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 20;

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 20;
    }

    if (limit > 100) {
        limit = 100;
    }

    return await importRepository.listar({
        page,
        limit
    });
};

export default {
    crearImportJob,
    obtenerPorId,
    listar
};