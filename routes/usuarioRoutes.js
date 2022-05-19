import express from "express";
import {registrar,autenticar,confirmar, olvidePassword,comprobarToken,nuevoPassword,perfil} from "../controllers/usuarioController.js";
const router = express.Router();
import checkOut from '../middleware/checkAuth.js';

// Creacion y registro de usuarios

// Autenticacion, Registro y Confirmacion de Usuarios
router.post('/',registrar);
router.post('/login',autenticar);
router.get('/confirmar/:token',confirmar)
router.post('/olvide-password',olvidePassword);
// router.get('/olvide-password/:token',comprobarToken);
// router.post('/olvide-password/:token',nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil',checkOut,perfil)



export default router;