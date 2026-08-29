import ImportJob from "./importJob.model.js";

const crear = async (datos) => {
    const importJob = new ImportJob(datos);

    return await importJob.save();
};

const obtenerPorId = async (id) => {
    return await ImportJob.findById(id);
};

const obtenerPorIdConUsuario = async (id) => {
    return await ImportJob
        .findById(id)
        .populate("usuarioId", "email rol")
        .populate("proveedorId", "nombre slug");
};

const actualizar = async (id, datos) => {
    return await ImportJob.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

const listar = async ({
    page,
    limit
}) => {

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ImportJob
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        ImportJob.countDocuments()
    ]);

    return {
        data,
        page,
        limit,
        total
    };
};

export default {
    crear,
    obtenerPorId,
    obtenerPorIdConUsuario,
    actualizar,
    listar
};