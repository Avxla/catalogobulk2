import app from "./app.js";
import { env } from "./config/env.js";
import { conectarMongo } from "./config/db.js";

const iniciarServidor = async () => {
    try {
        await conectarMongo();

        app.listen(env.PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${env.PORT}`);
        });

    } catch (error) {
        console.error("❌ Error iniciando el servidor");
        console.error(error);
        process.exit(1);
    }
};

iniciarServidor();