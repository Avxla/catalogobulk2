const rol = (rolPermitido) => {

    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                error: "No autenticado"
            });
        }

        if (req.usuario.rol !== rolPermitido) {
            return res.status(403).json({
                error: "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
};

export default rol;