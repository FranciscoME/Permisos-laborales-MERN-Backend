import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import permisoRoutes from "./routes/permisoRoutes.js";

const app = express();
app.use(express.json());//permitir el req.body
dotenv.config();//cargar variables de entorno

conectarDB();

// CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('error de cors'));
        }
    }
}

app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/permisos', permisoRoutes);

const PORT = process.env.PORT || 4000;

console.log('desde index.js')
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})