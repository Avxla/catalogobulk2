import productoService from "./producto.service.js";

const listar = async (req, res, next) => {

    try {

        const resultado =
            await productoService.listar(req.query);

        res.status(200).json(resultado);

    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {

    try {

        const producto =
            await productoService.obtener(
                req.params.id
            );

        res.status(200).json(producto);

    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {

    try {

        const producto =
            await productoService.crear(req.body);

        res.status(201).json(producto);

    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {

    try {

        const producto =
            await productoService.actualizar(
                req.params.id,
                req.body
            );

        res.status(200).json(producto);

    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {

    try {

        await productoService.eliminar(
            req.params.id
        );

        res.status(204).send();

    } catch (err) {
        next(err);
    }
};

const estadisticas = async (req, res, next) => {

    try {

        const resultado =
            await productoService.estadisticas();

        res.status(200).json(resultado);

    } catch (err) {
        next(err);
    }
};

export default {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
    estadisticas
};