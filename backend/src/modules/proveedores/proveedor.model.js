import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        },

        contactoEmail: {
            type: String,
            default: null,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (valor) {
                    if (valor === null) return true;

                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
                },
                message: "contactoEmail no tiene un formato válido"
            }
        },

        logoUrl: {
            type: String,
            default: null,
            validate: {
                validator: function (valor) {
                    if (valor === null) return true;

                    return /^https?:\/\/.+/i.test(valor);
                },
                message: "logoUrl debe ser una URL http(s) válida"
            }
        },

        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Proveedor",
    proveedorSchema
);