import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const auth = (req, res, next) => {

    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: "Token requerido"
            });
        }

        const partes = authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer"
        ) {
            return res.status(401).json({
                error: "Formato de token inválido"
            });
        }

        const token = partes[1];

        const payload = jwt.verify(
            token,
            env.JWT_SECRET
        );

        req.usuario = {
            id: payload.sub,
            rol: payload.rol
        };

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Token inválido o expirado"
        });
    }
};

export default auth;