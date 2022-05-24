import express from "express";

import{
  descargarPermisoPDF
} from '../controllers/permisoController.js';

import checkOut from "../middleware/checkAuth.js";


const router = express.Router();

router.get('/:id', checkOut, descargarPermisoPDF);
router.get("/image.png", (req, res) => {
  const __dirname = path.resolve(path.dirname(''));
  res.sendFile(path.join(__dirname, "./assets/psiq.png"));
});


export default router;