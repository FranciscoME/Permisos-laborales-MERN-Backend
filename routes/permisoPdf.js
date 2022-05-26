import express from "express";

import{
  descargarPermisoPDF
} from '../controllers/permisoController.js';

import checkOut from "../middleware/checkAuth.js";


const router = express.Router();

router.get('/:id', checkOut, descargarPermisoPDF);



export default router;