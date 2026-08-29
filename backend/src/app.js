import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import proveedorRoutes from "./modules/proveedores/proveedor.routes.js";
import categoriaRoutes from "./modules/categorias/categoria.routes.js";
import productoRoutes from "./modules/productos/producto.routes.js";
import importRoutes from "./modules/imports/import.routes.js"; // o imports según tu carpeta

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        mongo: "real",
        redis: "desactivado"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/imports", importRoutes);

app.use(errorHandler);

export default app;