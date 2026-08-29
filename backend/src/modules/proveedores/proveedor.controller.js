import proveedorService from "./proveedor.service.js";

const listar = async (req, res, next) => {

    try {

        const resultado =
            await proveedorService.listar(req.query);

        res.status(200).json(resultado);

    } catch (error) {

        next(error);
    }
};

const obtener = async (req, res, next) => {

    try {

        const proveedor =
            await proveedorService.obtenerPorId(
                req.params.id
            );

        res.status(200).json(proveedor);

    } catch (error) {

        next(error);
    }
};

const crear = async (req, res, next) => {

    try {

        const proveedor =
            await proveedorService.crear(req.body);

        res.status(201).json(proveedor);

    } catch (error) {

        next(error);
    }
};

const actualizar = async (req, res, next) => {

    try {

        const proveedor =
            await proveedorService.actualizar(
                req.params.id,
                req.body
            );

        res.status(200).json(proveedor);

    } catch (error) {

        next(error);
    }
};

const eliminar = async (req, res, next) => {

    try {

        await proveedorService.eliminar(
            req.params.id
        );

        res.status(204).send();

    } catch (error) {

        next(error);
    }
};

export default {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
};