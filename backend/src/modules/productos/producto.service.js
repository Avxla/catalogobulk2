import mongoose from "mongoose";

import productoRepository from "./producto.repository.js";
import proveedorRepository from "../proveedores/proveedor.repository.js";

const error = (mensaje, status) => {

    const err = new Error(mensaje);
    err.status = status;

    return err;
};

const listar = async (query) => {

    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 20;

    if (page < 1) page = 1;

    if (limit < 1) limit = 20;

    if (limit > 100) limit = 100;

    let disponible;

    if (query.disponible !== undefined) {

        if (
            query.disponible !== "true" &&
            query.disponible !== "false"
        ) {
            throw error(
                "disponible debe ser true o false",
                400
            );
        }

        disponible = query.disponible === "true";
    }

    return await productoRepository.listar({
        page,
        limit,
        categoria: query.categoria,
        proveedor: query.proveedor,
        disponible
    });
};

const obtener = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw error(
            "ID de producto inválido",
            400
        );
    }

    const producto =
        await productoRepository.obtenerPorId(id);

    if (!producto) {
        throw error(
            "Producto no encontrado",
            404
        );
    }

    return producto;
};

const crear = async (datos) => {

    if (
        !datos.sku ||
        !datos.nombre ||
        datos.precio === undefined ||
        !datos.categoria ||
        !datos.proveedorId
    ) {
        throw error(
            "sku, nombre, precio, categoria y proveedorId son obligatorios",
            400
        );
    }

    if (!mongoose.isValidObjectId(datos.proveedorId)) {
        throw error(
            "proveedorId inválido",
            400
        );
    }

    if (datos.precio < 0) {
        throw error(
            "El precio no puede ser negativo",
            400
        );
    }

    const stock = datos.stock ?? 0;

    if (
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        throw error(
            "El stock debe ser un entero mayor o igual a 0",
            400
        );
    }

    const proveedor =
        await proveedorRepository.obtenerPorId(
            datos.proveedorId
        );

    if (!proveedor) {
        throw error(
            "Proveedor no encontrado",
            404
        );
    }

    const sku =
        datos.sku.trim().toUpperCase();

    const existente =
        await productoRepository.buscarPorSku(sku);

    if (existente) {
        throw error(
            "El SKU ya existe",
            409
        );
    }

    return await productoRepository.crear({
        sku,
        nombre: datos.nombre
            .trim()
            .replace(/\s+/g, " "),

        precio: Number(
            Number(datos.precio).toFixed(2)
        ),

        stock,

        categoria: datos.categoria
            .trim()
            .toLowerCase(),

        descripcion:
            datos.descripcion?.trim() || null,

        imagenUrl:
            datos.imagenUrl?.trim() || null,

        proveedorId: datos.proveedorId,

        disponible: stock > 0
    });
};

const actualizar = async (id, datos) => {

    if (!mongoose.isValidObjectId(id)) {
        throw error(
            "ID de producto inválido",
            400
        );
    }

    const producto =
        await productoRepository.obtenerPorId(id);

    if (!producto) {
        throw error(
            "Producto no encontrado",
            404
        );
    }

    const actualizacion = {};

    if (datos.sku !== undefined) {

        const sku =
            datos.sku.trim().toUpperCase();

        const existente =
            await productoRepository.buscarPorSku(sku);

        if (
            existente &&
            existente._id.toString() !== id
        ) {
            throw error(
                "El SKU ya existe",
                409
            );
        }

        actualizacion.sku = sku;
    }

    if (datos.nombre !== undefined) {
        actualizacion.nombre =
            datos.nombre
                .trim()
                .replace(/\s+/g, " ");
    }

    if (datos.precio !== undefined) {

        if (datos.precio < 0) {
            throw error(
                "El precio no puede ser negativo",
                400
            );
        }

        actualizacion.precio =
            Number(
                Number(datos.precio).toFixed(2)
            );
    }

    if (datos.stock !== undefined) {

        if (
            !Number.isInteger(datos.stock) ||
            datos.stock < 0
        ) {
            throw error(
                "El stock debe ser un entero mayor o igual a 0",
                400
            );
        }

        actualizacion.stock = datos.stock;
        actualizacion.disponible =
            datos.stock > 0;
    }

    if (datos.categoria !== undefined) {
        actualizacion.categoria =
            datos.categoria
                .trim()
                .toLowerCase();
    }

    if (datos.descripcion !== undefined) {
        actualizacion.descripcion =
            datos.descripcion?.trim() || null;
    }

    if (datos.imagenUrl !== undefined) {
        actualizacion.imagenUrl =
            datos.imagenUrl?.trim() || null;
    }

    if (datos.proveedorId !== undefined) {

        if (
            !mongoose.isValidObjectId(
                datos.proveedorId
            )
        ) {
            throw error(
                "proveedorId inválido",
                400
            );
        }

        const proveedor =
            await proveedorRepository.obtenerPorId(
                datos.proveedorId
            );

        if (!proveedor) {
            throw error(
                "Proveedor no encontrado",
                404
            );
        }

        actualizacion.proveedorId =
            datos.proveedorId;
    }

    return await productoRepository.actualizar(
        id,
        actualizacion
    );
};

const eliminar = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw error(
            "ID de producto inválido",
            400
        );
    }

    const producto =
        await productoRepository.eliminar(id);

    if (!producto) {
        throw error(
            "Producto no encontrado",
            404
        );
    }

    return producto;
};

const estadisticas = async () => {
    return await productoRepository.estadisticas();
};

export default {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
    estadisticas
};