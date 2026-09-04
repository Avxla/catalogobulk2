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
        contacto: {
            type: String,
            trim: true,
            default: null
        },
        telefono: {
            type: String,
            trim: true,
            default: null
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },
        direccion: {
            type: String,
            trim: true,
            default: null
        },
        contactoEmail: {
            type: String,
            default: null,
            lowercase: true,
            trim: true
        },
        logoUrl: {
            type: String,
            default: null
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

export default mongoose.model("Proveedor", proveedorSchema);