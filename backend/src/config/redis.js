import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,

    maxRetriesPerRequest: null
});

redis.on("connect", () => {
    console.log("🟢 Redis conectado");
});

redis.on("ready", () => {
    console.log("🟢 Redis listo");
});

redis.on("error", (error) => {
    console.error("🔴 Error de Redis:", error.message);
});

redis.on("close", () => {
    console.log("🟡 Redis desconectado");
});

export const conectarRedis = async () => {
    try {

        if (redis.status === "ready") {
            return redis;
        }

        await new Promise((resolve, reject) => {

            const timeout = setTimeout(() => {
                reject(
                    new Error(
                        "Tiempo de espera agotado al conectar Redis"
                    )
                );
            }, 5000);

            redis.once("ready", () => {
                clearTimeout(timeout);
                resolve();
            });

            redis.once("error", (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });

        return redis;

    } catch (error) {

        console.error(
            "🔴 No se pudo conectar a Redis:",
            error.message
        );

        throw error;
    }
};

export default redis;