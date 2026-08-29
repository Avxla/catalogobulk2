import fs from "fs";
import path from "path";
import csv from "csv-parser";

import ImportJob from "../modules/imports/importJob.model.js";
import Producto from "../modules/productos/producto.model.js";
import categoriaService
    from "../modules/categorias/categoria.service.js";

const leerCSV = (archivoRuta) => {

    return new Promise((resolve, reject) => {

        const resultados = [];

        fs.createReadStream(archivoRuta)
            .pipe(csv())
            .on("data", (fila) => {
                resultados.push(fila);
            })
            .on("end", () => {
                resolve(resultados);
            })
            .on("error", reject);
    });
};
const TAMANO_LOTE = 500;
const obtenerOCrearCategoria = async (nombre) => {

    const nombreNormalizado =
        nombre
            .trim()
            .toLowerCase();

    let categoria =
        await categoriaService.buscarPorNombre(
            nombreNormalizado
        );

    if (!categoria) {

        categoria =
            await categoriaService.crear({
                nombre: nombreNormalizado,
                descripcion:
                    "Categoría creada automáticamente durante una importación"
            });

        console.log(
            `🟢 Categoría creada: ${nombreNormalizado}`
        );
    }

    return categoria;
};
const procesarLote = async ({
    productos,
    proveedorId
}) => {

    if (productos.length === 0) {
        return 0;
    }

    const operaciones = productos.map((producto) => ({
        updateOne: {
            filter: {
                sku: producto.sku
            },

            update: {
                $set: {
                    ...producto,
                    proveedorId,
                    disponible: producto.stock > 0
                }
            },

            upsert: true
        }
    }));

    const resultado =
        await Producto.bulkWrite(
            operaciones,
            {
                ordered: false
            }
        );

    return (
        (resultado.upsertedCount || 0) +
        (resultado.modifiedCount || 0)
    );
};
const leerJSON = async (archivoRuta) => {

    const contenido =
        await fs.promises.readFile(
            archivoRuta,
            "utf-8"
        );

    return JSON.parse(contenido);
};

const leerArchivo = async (archivoRuta) => {

    const extension =
        path.extname(archivoRuta).toLowerCase();

    if (extension === ".csv") {
        return await leerCSV(archivoRuta);
    }

    if (extension === ".json") {
        return await leerJSON(archivoRuta);
    }

    throw new Error(
        "Formato de archivo no soportado"
    );
};

const normalizarProducto = (fila) => {

    const sku =
        String(fila.sku || "")
            .trim()
            .toUpperCase();

    const nombre =
        String(fila.nombre || "")
            .trim()
            .replace(/\s+/g, " ");

    const precio =
        Number(fila.precio);

    const stock =
        Number(fila.stock);

    const categoria =
        String(fila.categoria || "")
            .trim()
            .toLowerCase();

    return {
        sku,
        nombre,
        precio,
        stock,
        categoria,

        descripcion:
            fila.descripcion
                ? String(fila.descripcion).trim()
                : null,

        imagenUrl:
            fila.imagenUrl
                ? String(fila.imagenUrl).trim()
                : null
    };
};

const validarProducto = (producto) => {

    const errores = [];

    if (!producto.sku) {
        errores.push("SKU obligatorio");
    }

    if (!producto.nombre) {
        errores.push("Nombre obligatorio");
    }

    if (
        !Number.isFinite(producto.precio) ||
        producto.precio < 0
    ) {
        errores.push("Precio inválido");
    }

    if (
        !Number.isInteger(producto.stock) ||
        producto.stock < 0
    ) {
        errores.push("Stock inválido");
    }

    if (!producto.categoria) {
        errores.push("Categoría obligatoria");
    }

    return errores;
};
const procesarImportacion = async ({
    importJobId,
    archivoRuta,
    proveedorId,
    job
}) => {

    const importJob =
        await ImportJob.findById(
            importJobId
        );

    if (!importJob) {
        throw new Error(
            "ImportJob no encontrado"
        );
    }

    await ImportJob.findByIdAndUpdate(
        importJobId,
        {
            estado: "processing",
            startedAt: new Date()
        }
    );

    try {

        const filas =
            await leerArchivo(archivoRuta);

        const total = filas.length;

        await ImportJob.findByIdAndUpdate(
            importJobId,
            {
                total
            }
        );



        const productos = [];
        const errores = [];

        const skusArchivo = new Set();

        for (
            let i = 0;
            i < filas.length;
            i++
        ) {

            const fila = filas[i];

            const producto =
                normalizarProducto(fila);

            const erroresFila =
                validarProducto(producto);

            // -------------------------
            // VALIDACIONES
            // -------------------------

            if (erroresFila.length > 0) {

                errores.push({
                    fila: i + 1,
                    sku: producto.sku || null,
                    motivo: erroresFila.join(", ")
                });

                continue;
            }

            // -------------------------
            // SKU DUPLICADO
            // -------------------------

            if (skusArchivo.has(producto.sku)) {

                errores.push({
                    fila: i + 1,
                    sku: producto.sku,
                    motivo: "SKU duplicado dentro del archivo"
                });

                continue;
            }

            skusArchivo.add(producto.sku);

            // -------------------------
            // PRODUCTO VÁLIDO
            // -------------------------

            const categoria =
                await obtenerOCrearCategoria(
                    producto.categoria
                );

            productos.push({
                ...producto,

                categoria: categoria.nombre,

                proveedorId,

                disponible:
                    producto.stock > 0
            });

            await job.updateProgress(
                Math.round(
                    ((i + 1) / total) * 100
                )
            );
        }

        let exitosos = 0;

        for (
            let inicio = 0;
            inicio < productos.length;
            inicio += TAMANO_LOTE
        ) {

            const lote = productos.slice(
                inicio,
                inicio + TAMANO_LOTE
            );

            exitosos += await procesarLote({
                productos: lote,
                proveedorId
            });

            await job.updateProgress(
                Math.round(
                    ((inicio + lote.length) / total) * 100
                )
            );
        }

        const fallidos =
            errores.length;

        await ImportJob.findByIdAndUpdate(
            importJobId,
            {
                estado: "completed",
                procesados: total,
                exitosos,
                fallidos,
                errores,
                finishedAt: new Date()
            }
        );

        return {
            total,
            procesados: total,
            exitosos,
            fallidos
        };

    } catch (error) {

        await ImportJob.findByIdAndUpdate(
            importJobId,
            {
                estado: "failed",
                motivoFallo: error.message,
                finishedAt: new Date()
            }
        );

        throw error;
    }
};

export {
    procesarImportacion
};