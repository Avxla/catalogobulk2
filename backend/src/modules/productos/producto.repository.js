import Producto from "./producto.model.js";

const listar = async ({
    page,
    limit,
    categoria,
    proveedor,
    disponible
}) => {

    const filtro = {};

    if (categoria) {
        filtro.categoria = categoria;
    }

    if (proveedor) {
        filtro.proveedorId = proveedor;
    }

    if (disponible !== undefined) {
        filtro.disponible = disponible;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Producto
            .find(filtro)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Producto.countDocuments(filtro)
    ]);

    return {
        data,
        page,
        limit,
        total
    };
};

const obtenerPorId = async (id) => {
    return await Producto.findById(id);
};

const buscarPorSku = async (sku) => {
    return await Producto.findOne({
        sku
    });
};

const crear = async (datos) => {

    const producto = new Producto(datos);

    return await producto.save();
};

const actualizar = async (id, datos) => {

    return await Producto.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminar = async (id) => {
    return await Producto.findByIdAndDelete(id);
};

const estadisticas = async () => {

    const totalProductos =
        await Producto.countDocuments();

    const promedio =
        await Producto.aggregate([
            {
                $group: {
                    _id: null,
                    promedio: {
                        $avg: "$precio"
                    }
                }
            }
        ]);

    const porCategoria =
        await Producto.aggregate([
            {
                $group: {
                    _id: "$categoria",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoria: "$_id",
                    count: 1
                }
            },
            {
                $sort: {
                    categoria: 1
                }
            }
        ]);

    return {
        totalProductos,
        precioPromedio: promedio.length
            ? Number(promedio[0].promedio.toFixed(2))
            : 0,
        porCategoria
    };
};

export default {
    listar,
    obtenerPorId,
    buscarPorSku,
    crear,
    actualizar,
    eliminar,
    estadisticas
};