import mongoose from "mongoose";

const importJobSchema = new mongoose.Schema(
    {
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        proveedorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proveedor",
            required: true
        },

        archivoNombre: {
            type: String,
            required: true,
            trim: true
        },

        archivoRuta: {
            type: String,
            required: true
        },

        estado: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed"
            ],
            default: "pending"
        },

        total: {
            type: Number,
            default: 0
        },

        procesados: {
            type: Number,
            default: 0
        },

        exitosos: {
            type: Number,
            default: 0
        },

        fallidos: {
            type: Number,
            default: 0
        },

        errores: [
            {
                fila: {
                    type: Number
                },

                sku: {
                    type: String
                },

                motivo: {
                    type: String
                }
            }
        ],

        bullJobId: {
            type: String,
            default: null
        },

        motivoFallo: {
            type: String,
            default: null
        },

        startedAt: {
            type: Date,
            default: null
        },

        finishedAt: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);

const ImportJob = mongoose.model(
    "ImportJob",
    importJobSchema,
    "import_jobs"
);

export default ImportJob;