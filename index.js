import express from "express";

import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import permisoRoutes from "./routes/permisoRoutes.js";
import permisoPdf from "./routes/permisoPdf.js";

const app = express();
app.use(express.json());//permitir el req.body
dotenv.config();//cargar variables de entorno
conectarDB();

// CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        // console.log('whitelist: ',whitelist);
        // console.log('origen: ',origin)
        if (whitelist.includes(origin)) {
            // console.log('paso cors')
            callback(null, true);
        }
        else {
            callback(new Error('error de cors'));
        }
    }
}

app.use(cors(corsOptions));

// Rutas



// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/permisopdf', permisoPdf);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})