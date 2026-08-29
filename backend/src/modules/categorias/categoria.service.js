import categoriaRepository from "./categoria.repository.js";

const listar = async () => {

    return await categoriaRepository.listar();
};

const obtenerPorId = async (id) => {

    const categoria =
        await categoriaRepository.obtenerPorId(id);

    if (!categoria) {
        throw new Error(
            "Categoría no encontrada"
        );
    }

    return categoria;
};

const crear = async (datos) => {

    const nombre =
        datos.nombre
            ?.trim()
            .toLowerCase();

    if (!nombre) {
        throw new Error(
            "El nombre de la categoría es obligatorio"
        );
    }

    const existente =
        await categoriaRepository.buscarPorNombre(
            nombre
        );

    if (existente) {
        throw new Error(
            "La categoría ya existe"
        );
    }

    return await categoriaRepository.crear({
        ...datos,
        nombre
    });
};

const actualizar = async (id, datos) => {

    if (datos.nombre) {

        datos.nombre =
            datos.nombre
                .trim()
                .toLowerCase();
    }

    return await categoriaRepository.actualizar(
        id,
        datos
    );
};

const eliminar = async (id) => {

    const categoria =
        await categoriaRepository.obtenerPorId(id);

    if (!categoria) {
        throw new Error(
            "Categoría no encontrada"
        );
    }

    return await categoriaRepository.eliminar(id);
};

const buscarPorNombre = async (nombre) => {

    return await categoriaRepository.buscarPorNombre(
        nombre
    );
};

export default {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    buscarPorNombre
};