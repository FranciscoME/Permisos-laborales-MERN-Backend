import Permiso from "../models/Permiso.js";


const nuevoPermiso = async (req, res) => {
  const permiso = new Permiso(req.body);
  permiso.creador = req.usuario._id;

  try {
    const permisoAlmacenado = await permiso.save();
    res.json(permisoAlmacenado);
  } catch (error) {
    console.log(error)
  }

}

const obtenerPermisos = async (req, res) => {
  const permisos = await Permiso.find().where('creador').equals(req.usuario).where('eliminado').equals(false);

  res.json(permisos);
}

const obtenerPermiso = async (req, res) => {
  const { id } = req.params;

  const permiso = await Permiso.findById(id);

  if (!permiso) {
    const error = new Error('Permiso no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (permiso.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos necesarios');

    return res.status(404).json({ msg: error.message });

  }

  res.json(permiso);
}



const modificarPermiso = async (req, res) => {
  const { id } = req.params;

  const permiso = await Permiso.findById(id);

  if (!permiso) {
    const error = new Error('Permiso no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (permiso.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos necesarios');

    return res.status(404).json({ msg: error.message });

  }

  permiso.concepto = req.body.concepto || permiso.concepto;
  permiso.notas = req.body.notas || permiso.notas;
  permiso.fechaCreacion = req.body.fechaCreacion || permiso.fechaCreacion;
  permiso.fechas = req.body.fechas || permiso.fechas;

  try {
    const permisoAlmacenado = await permiso.save();
    return res.json(permisoAlmacenado);
  } catch (error) {
    console.log(error)
  }

  res.json(permiso);
}

const eliminarPermiso = async (req, res) => {
  const { id } = req.params;

  const permiso = await Permiso.findById(id);

  if (!permiso) {
    const error = new Error('Permiso no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (permiso.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos necesarios');

    return res.status(404).json({ msg: error.message });

  }

  permiso.eliminado = true;

  try {
    const permisoAlmacenado = await permiso.save();
    return res.json(permisoAlmacenado);
  } catch (error) {
    console.log(error)
  }

  res.json(permiso);
}


export {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso
}