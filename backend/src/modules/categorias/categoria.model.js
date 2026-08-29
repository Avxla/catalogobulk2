import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 1
        },

        descripcion: {
            type: String,
            default: null,
            trim: true
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
    "Categoria",
    categoriaSchema
);