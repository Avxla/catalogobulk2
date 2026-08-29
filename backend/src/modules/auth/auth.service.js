import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import authRepository from "./auth.repository.js";
import { env } from "../../config/env.js";

const registrar = async ({ email, password, rol }) => {

    if (!email || !password) {
        const error = new Error("Email y password son obligatorios");
        error.status = 400;
        throw error;
    }

    const usuarioExistente = await authRepository.buscarPorEmail(email);

    if (usuarioExistente) {
        const error = new Error("El email ya está registrado");
        error.status = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await authRepository.crear({
        email,
        password: passwordHash,
        rol: rol || "user"
    });

    return {
        id: usuario._id,
        email: usuario.email,
        rol: usuario.rol
    };
};

const login = async ({ email, password }) => {

    if (!email || !password) {
        const error = new Error("Email y password son obligatorios");
        error.status = 400;
        throw error;
    }

    const usuario = await authRepository.buscarPorEmail(email);

    if (!usuario) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }

    const passwordCorrecto = await bcrypt.compare(
        password,
        usuario.password
    );

    if (!passwordCorrecto) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            rol: usuario.rol
        },
        env.JWT_SECRET,
        {
            subject: usuario._id.toString(),
            expiresIn: env.JWT_EXPIRES_IN
        }
    );

    return {
        token
    };
};

export default {
    registrar,
    login
};