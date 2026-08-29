import categoriaService from "./categoria.service.js";

const listar = async (req, res, next) => {

    try {

        const categorias =
            await categoriaService.listar();

        res.json(categorias);

    } catch (error) {
        next(error);
    }
};

const obtenerPorId = async (req, res, next) => {

    try {

        const categoria =
            await categoriaService.obtenerPorId(
                req.params.id
            );

        res.json(categoria);

    } catch (error) {
        next(error);
    }
};

const crear = async (req, res, next) => {

    try {

        const categoria =
            await categoriaService.crear(
                req.body
            );

        res.status(201).json(categoria);

    } catch (error) {
        next(error);
    }
};

const actualizar = async (req, res, next) => {

    try {

        const categoria =
            await categoriaService.actualizar(
                req.params.id,
                req.body
            );

        res.json(categoria);

    } catch (error) {
        next(error);
    }
};

const eliminar = async (req, res, next) => {

    try {

        await categoriaService.eliminar(
            req.params.id
        );

        res.json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        next(error);
    }
};

export default {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};