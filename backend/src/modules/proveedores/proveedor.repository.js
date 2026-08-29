import Proveedor from "./proveedor.model.js";
import Producto from "../productos/producto.model.js";

const listar = async ({
    page,
    limit,
    activo
}) => {

    const filtro = {};

    if (activo !== undefined) {
        filtro.activo = activo;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Proveedor
            .find(filtro)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),

        Proveedor.countDocuments(filtro)
    ]);

    return {
        data,
        page,
        limit,
        total
    };
};

const obtenerPorId = async (id) => {
    return await Proveedor.findById(id);
};

const buscarPorNombre = async (nombre) => {
    return await Proveedor.findOne({
        nombre
    });
};

const buscarPorSlug = async (slug) => {
    return await Proveedor.findOne({
        slug
    });
};

const crear = async (datos) => {

    const proveedor = new Proveedor(datos);

    return await proveedor.save();
};

const actualizar = async (id, datos) => {

    return await Proveedor.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminar = async (id) => {

    return await Proveedor.findByIdAndDelete(id);
};

const tieneProductos = async (proveedorId) => {

    const producto = await Producto.findOne({
        proveedorId
    }).select("_id");

    return !!producto;
};

export default {
    listar,
    obtenerPorId,
    buscarPorNombre,
    buscarPorSlug,
    crear,
    actualizar,
    eliminar,
    tieneProductos
};