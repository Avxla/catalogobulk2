import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
    {
        activo: {
            type: Boolean,
            default: true,
            index: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            uppercase: true
        },

        nombre: {
            type: String,
            required: true,
            trim: true
        },

        precio: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        categoria: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },

        descripcion: {
            type: String,
            default: null,
            trim: true
        },

        imagenUrl: {
            type: String,
            default: null
        },

        proveedorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proveedor",
            required: true,
            index: true
        },

        disponible: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

productoSchema.pre("save", function (next) {
    this.disponible = this.stock > 0;
    next();
});

productoSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate();

    if (update.stock !== undefined) {
        if (!update.$set) update.$set = {};
        update.$set.disponible = update.stock > 0;
    } else if (update.$set && update.$set.stock !== undefined) {
        update.$set.disponible = update.$set.stock > 0;
    }
});
export default mongoose.model(
    "Producto",
    productoSchema
);