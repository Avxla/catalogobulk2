import mongoose from "mongoose";

import proveedorRepository from "./proveedor.repository.js";

const crearError = (mensaje, status) => {

    const error = new Error(mensaje);

    error.status = status;

    return error;
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

    let activo;

    if (query.activo !== undefined) {

        if (
            query.activo !== "true" &&
            query.activo !== "false"
        ) {
            throw crearError(
                "El filtro activo debe ser true o false",
                400
            );
        }

        activo = query.activo === "true";
    }

    return await proveedorRepository.listar({
        page,
        limit,
        activo
    });
};

const obtenerPorId = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw crearError(
            "El ID del proveedor no es válido",
            400
        );
    }

    const proveedor =
        await proveedorRepository.obtenerPorId(id);

    if (!proveedor) {
        throw crearError(
            "Proveedor no encontrado",
            404
        );
    }

    return proveedor;
};

const crear = async (datos) => {

    if (!datos.slug && datos.nombre) {
        datos.slug = datos.nombre
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    const {
        nombre,
        slug,
        contacto,
        telefono,
        email,
        direccion,
        logoUrl
    } = datos;

    if (!nombre || !slug) {
        throw crearError(
            "nombre y slug son obligatorios",
            400
        );
    }

    const nombreLimpio = nombre.trim();
    const slugLimpio = slug.trim().toLowerCase();

    const proveedorPorNombre =
        await proveedorRepository.buscarPorNombre(
            nombreLimpio
        );

    if (proveedorPorNombre) {
        throw crearError(
            "El nombre del proveedor ya existe",
            409
        );
    }

    const proveedorPorSlug =
        await proveedorRepository.buscarPorSlug(
            slugLimpio
        );

    if (proveedorPorSlug) {
        throw crearError(
            "El slug del proveedor ya existe",
            409
        );
    }

    return await proveedorRepository.crear({
        nombre: nombreLimpio,
        slug: slugLimpio,
        contacto: contacto?.trim() || null,
        telefono: telefono?.trim() || null,
        email: email?.trim().toLowerCase() || null,
        direccion: direccion?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        activo: true
    });
};
const actualizar = async (id, datos) => {

    if (!mongoose.isValidObjectId(id)) {
        throw crearError(
            "El ID del proveedor no es válido",
            400
        );
    }

    const proveedor =
        await proveedorRepository.obtenerPorId(id);

    if (!proveedor) {
        throw crearError(
            "Proveedor no encontrado",
            404
        );
    }

    if (datos.nombre !== undefined) {

        const nombreLimpio = datos.nombre.trim();

        const otroProveedor =
            await proveedorRepository.buscarPorNombre(
                nombreLimpio
            );

        if (
            otroProveedor &&
            otroProveedor._id.toString() !== id
        ) {
            throw crearError(
                "El nombre del proveedor ya existe",
                409
            );
        }

        datos.nombre = nombreLimpio;
    }

    if (datos.slug !== undefined) {

        const slugLimpio =
            datos.slug.trim().toLowerCase();

        const otroProveedor =
            await proveedorRepository.buscarPorSlug(
                slugLimpio
            );

        if (
            otroProveedor &&
            otroProveedor._id.toString() !== id
        ) {
            throw crearError(
                "El slug del proveedor ya existe",
                409
            );
        }

        datos.slug = slugLimpio;
    }

    if (datos.contactoEmail !== undefined) {

        datos.contactoEmail =
            datos.contactoEmail?.trim().toLowerCase() || null;
    }

    if (datos.logoUrl !== undefined) {

        datos.logoUrl =
            datos.logoUrl?.trim() || null;
    }

    return await proveedorRepository.actualizar(
        id,
        datos
    );
};

const eliminar = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw crearError(
            "El ID del proveedor no es válido",
            400
        );
    }

    const proveedor =
        await proveedorRepository.obtenerPorId(id);

    if (!proveedor) {
        throw crearError(
            "Proveedor no encontrado",
            404
        );
    }

    const tieneProductos =
        await proveedorRepository.tieneProductos(id);

    if (tieneProductos) {
        throw crearError(
            "No se puede eliminar el proveedor porque tiene productos asociados. Desactívalo en su lugar.",
            409
        );
    }

    await proveedorRepository.eliminar(id);
};

export default {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};