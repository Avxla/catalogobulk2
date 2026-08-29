import importService from "./import.service.js";

const crear = async (req, res, next) => {
    try {
        const importJob = await importService.crearImportJob({
            usuarioId: req.usuario.id,
            proveedorId: req.body.proveedorId,
            archivo: req.file
        });

        res.status(202).json({
            importJobId: importJob._id,
            estado: importJob.estado
        });

    } catch (error) {
        next(error);
    }
};

const obtener = async (req, res, next) => {
    try {
        const importJob = await importService.obtenerPorId(
            req.params.id,
            req.usuario
        );

        res.status(200).json(importJob);

    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await importService.listar(req.query);

        res.status(200).json(resultado);

    } catch (error) {
        next(error);
    }
};

export default {
    crear,
    obtener,
    listar
};