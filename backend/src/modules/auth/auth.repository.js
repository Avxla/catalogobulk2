import Usuario from "./usuario.model.js";

const buscarPorEmail = async (email) => {
    return await Usuario.findOne({ email }).select("+password");
};

const buscarPorId = async (id) => {
    return await Usuario.findById(id);
};

const crear = async (datos) => {
    const usuario = new Usuario(datos);

    return await usuario.save();
};

export default {
    buscarPorEmail,
    buscarPorId,
    crear
};