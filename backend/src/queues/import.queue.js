import { Queue } from "bullmq";

import redis from "../config/redis.js";

const importQueue = new Queue(
    "imports",
    {
        connection: redis
    }
);

importQueue.on("error", (error) => {
    console.error(
        "🔴 Error en la cola de imports:",
        error.message
    );
});

export const agregarImport = async ({
    importJobId,
    archivoRuta,
    proveedorId
}) => {

    const job = await importQueue.add(
        "procesar-import",
        {
            importJobId: importJobId.toString(),
            archivoRuta,
            proveedorId: proveedorId.toString()
        },
        {
            jobId: importJobId.toString(),

            removeOnComplete: {
                count: 100
            },

            removeOnFail: {
                count: 100
            }
        }
    );

    return job;
};

export default importQueue;