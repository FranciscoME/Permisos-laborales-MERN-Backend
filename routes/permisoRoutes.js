import express from 'express';

import {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso,
  descargarPermisoPDF,
  obtenerDatosGeneralesPermisos
} from '../controllers/permisoController.js';
import checkOut from '../middleware/checkAuth.js';

const router = express.Router();


router.get('/datosgenerales', checkOut, obtenerDatosGeneralesPermisos);
router.get('/', checkOut, obtenerPermisos);

router.route('/').post(checkOut, nuevoPermiso);

router.route('/:id').get(checkOut, obtenerPermiso)
.put(checkOut, modificarPermiso)
.delete(checkOut, eliminarPermiso);


export default router;

