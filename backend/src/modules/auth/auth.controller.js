import authService from "./auth.service.js";

const registrar = async (req, res, next) => {
    try {
        const usuario = await authService.registrar(req.body);

        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const resultado = await authService.login(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export default {
    registrar,
    login
};