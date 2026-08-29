import Categoria from "./categoria.model.js";

const listar = async () => {

    return await Categoria
        .find()
        .sort({ nombre: 1 });
};

const obtenerPorId = async (id) => {

    return await Categoria.findById(id);
};

const buscarPorNombre = async (nombre) => {

    return await Categoria.findOne({
        nombre: nombre.trim()
    });
};

const crear = async (datos) => {

    const categoria =
        new Categoria(datos);

    return await categoria.save();
};

const actualizar = async (id, datos) => {

    return await Categoria.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminar = async (id) => {

    return await Categoria.findByIdAndDelete(id);
};

export default {
    listar,
    obtenerPorId,
    buscarPorNombre,
    crear,
    actualizar,
    eliminar
};