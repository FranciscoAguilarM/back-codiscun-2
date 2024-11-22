const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { connection } = require("../config/config.db");

// Configuración de multer para manejar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
    },
});

const upload = multer({ storage });

// Obtener todas las donaciones
router.get("/", (_req, res) => {
    connection.query("SELECT * FROM donaciones", (err, results) => {
        if (err) {
            console.error("Error al obtener donaciones:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        } else {
            res.status(200).json(results);
        }
    });
});

// Agregar una nueva donación (con imagen)
router.post("/", upload.single("imagen"), (req, res) => {
    const { nombres, apellidos, empresa, descripcion, articulo, fecha_embalaje, direccion, telefono } = req.body;
    const imagen = req.file ? req.file.filename : null; // Nombre del archivo subido

    connection.query(
        "INSERT INTO donaciones (nombres, apellidos, empresa, descripcion, articulo, fecha_embalaje, direccion, telefono, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [nombres, apellidos, empresa, descripcion, articulo, fecha_embalaje, direccion, telefono, imagen],
        (err, results) => {
            if (err) {
                console.error("Error al agregar donación:", err);
                res.status(500).json({ error: "Error interno del servidor" });
            } else {
                res.status(201).json({ mensaje: "Donación agregada correctamente", id: results.insertId });
            }
        }
    );
});

// Actualizar una donación existente
router.put("/:id", upload.single("imagen"), (req, res) => {
    const { nombres, apellidos, empresa, descripcion, articulo, fecha_embalaje, direccion, telefono } = req.body;
    const imagen = req.file ? req.file.filename : null; // Archivo subido
    const id = req.params.id;

    connection.query(
        "UPDATE donaciones SET nombres = ?, apellidos = ?, empresa = ?, descripcion = ?, articulo = ?, fecha_embalaje = ?, direccion = ?, telefono = ?, Imagen = ? WHERE id = ?",
        [nombres, apellidos, empresa, descripcion, articulo, fecha_embalaje, direccion, telefono, imagen, id],
        (err, results) => {
            if (err) {
                console.error("Error al actualizar donación:", err);
                res.status(500).json({ error: "Error interno del servidor" });
            } else {
                res.status(200).json({ mensaje: "Donación actualizada correctamente" });
            }
        }
    );
});

// Eliminar una donación
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    connection.query("DELETE FROM donaciones WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar donación:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        } else {
            res.status(200).json({ mensaje: "Donación eliminada correctamente" });
        }
    });
});

module.exports = router;
