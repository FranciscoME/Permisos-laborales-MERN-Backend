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

// router.get('/', checkOut, obtenerPermisos);
//  router.post('/', checkOut, nuevoPermiso);
router.route('/').get(checkOut, obtenerPermisos)
                 .post(checkOut, nuevoPermiso);

router.route('/:id').get(checkOut, obtenerPermiso)
                    .put(checkOut, modificarPermiso)
                    .delete(checkOut, eliminarPermiso);
                    // .patch(checkOut, descargarPermisoPDF);

export default router;

