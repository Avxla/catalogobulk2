import { Worker } from "bullmq";

import redis from "../config/redis.js";

import {
    procesarImportacion
} from "./import.processor.js";

const worker = new Worker(
    "imports",

    async (job) => {

        console.log("");
        console.log("📦 Nuevo import recibido");
        console.log("Job ID:", job.id);

        console.log(
            "ImportJob:",
            job.data.importJobId
        );

        console.log(
            "Archivo:",
            job.data.archivoRuta
        );

        console.log(
            "Proveedor:",
            job.data.proveedorId
        );

        const resultado =
            await procesarImportacion({
                importJobId:
                    job.data.importJobId,

                archivoRuta:
                    job.data.archivoRuta,

                proveedorId:
                    job.data.proveedorId,

                job
            });

        console.log("");
        console.log(
            "🟢 Importación completada"
        );

        console.log(
            resultado
        );

        return resultado;
    },

    {
        connection: redis,
        concurrency: 1
    }
);

worker.on("completed", (job) => {

    console.log(
        `🟢 Job ${job.id} completado`
    );
});

worker.on("failed", (job, error) => {

    console.error(
        `🔴 Job ${job?.id} falló:`,
        error.message
    );
});

worker.on("error", (error) => {

    console.error(
        "🔴 Error del Worker:",
        error.message
    );
});

console.log(
    "👷 Import Worker iniciado"
);