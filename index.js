const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Middlewares para procesar JSON y datos codificados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Carpeta pública para las imágenes subidas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas del proyecto
app.use("/donaciones", require("./Routes/Donaciones")); // Rutas para donaciones
app.use("/administradores", require("./Routes/Administradores")); // Rutas para administradores

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

// Exportar la app (útil para pruebas)
module.exports = app;
