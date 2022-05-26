import express from 'express';

import {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso,
  descargarPermisoPDF
} from '../controllers/permisoController.js';
import checkOut from '../middleware/checkAuth.js';

const router = express.Router();


router.get('/', checkOut, obtenerPermisos);
;
router.route('/').post(checkOut, nuevoPermiso);

router.route('/:id').get(checkOut, obtenerPermiso)
                    .put(checkOut, modificarPermiso)
                    .delete(checkOut, eliminarPermiso);

export default router;

