import { generarPDF } from "../helpers/generarPDF.js";
import Permiso from "../models/Permiso.js";
import { fechasATexto, formatearFecha } from "../helpers/formatearFecha.js";
// import PDFDocument from 'pdfkit'
import path from "path";
import { obtenerFechaInicioDeMes, obtenerFechaFinDeMes, obtenerFechaInicioAnio, obtenerFechaFinAnio } from "../helpers/operacionesFechas.js";


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
  // console.log('obtener permisos:')
  // console.log(req.query)
  // const {limite=1, desde=0} = req.query;
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 5;


  // const permisos =
  //   await Permiso.find().sort({ 'createdAt': -1 }).where('creador').
  //     equals(req.usuario).where('eliminado').equals(false)
  // res.json(permisos);

  // const {limite=5,desde=0} = req.query;

  // console.log(desde,' ', limite)
  const [total, permisos] = await Promise.all([
    Permiso.countDocuments().where('creador').equals(req.usuario).where('eliminado').equals(false),
    Permiso.find()
      .sort({ 'createdAt': -1 })
      .where('creador').equals(req.usuario)
      .where('eliminado').equals(false)
      .skip(Number(desde))
      .limit(Number(limite))
  ]);

  // console.log(permisos)
  res.json({ total, permisos });

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

const descargarPermisoPDF = async (req, res) => {
  const { id } = req.params;
  // console.log(req.usuario);

  const permiso = await Permiso.findById(id).populate('creador');
  // console.log(permiso)

  if (!permiso) {
    const error = new Error('Permiso no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (permiso.creador._id.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos necesarios');

    return res.status(404).json({ msg: error.message });
  }

  // const fechaCreacion = permiso.fechas[0].toISOString().split('T')[0];
  // console.log(fechaCreacion)


  const cwd = process.cwd();
  const base = `file://${cwd}/assets/psiq.png`;
  let img = path.normalize(base);



  const content = `
<<<<<<< HEAD
  <html style="zoom: 0.70;
=======
  <html style="zoom: 0.65;
>>>>>>> fd4a3894e6e6c6bfc8abe20ce1dbb48e8dd4d838
  border: 1px solid black;
  background-color: aliceblue;">
  <div style="border:1px solid black;">

    <div style="display: -webkit-flex; -webkit-flex-direction: row;">
    <img src='${img}' alt="logo-hospital" width="80" height="80" style="display: inline; margin-left: 15px; margin-top: 10px;float:left;">
   
     
      <div  style="display: inline; font-size: 20px; margin-left: 4cm; text-align: center; line-height: 1px; ">
        <p style="font-size:18px;">Secretaria de salud de Michoacan</p>
        <p style="font-size:18px;">Hospital Psiquiatrico</p>
        <p style="font-size:18px;">Dr. Jose Torres Orozco</p>
        <p style="font-size:18px;">Morelia, michoacan</p>
      </div>
    </div>
    <h1 style="font-size: 20px; text-align: center; margin-top: 5px;">Solicitud de permiso o vacaciones</h1>
  
    <div style="line-height: 8px;">
      <p style="font-weight: bold; font-size:18px; margin-left:20px;">Nombre del empleado: <span style="font-weight: normal;"> ${permiso.creador.nombre}</span></p>
      <p style="font-weight: bold; font-size:18px; margin-left:20px;">Departamento de adscripcion: <span style="font-weight: normal;"> ${permiso.creador.departamento}</span></p>
      <p style="font-weight: bold; font-size:18px; margin-left:20px; margin-left:20px; text-decoration: underline;">Permiso solicitado: <span style="font-weight: normal; "> ${permiso.concepto}</span></p>
    </div>
   
    
    <div style="line-height: 16px;">
      <p style ='font-weight: bold; font-size: 16px; text-align:center;'>Descripcion</p>
      <p style="width: 85%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">${permiso.notas}</p>
    </div>

    <div style="line-height: 16px;">
      <p style ='font-weight: bold; font-size: 16px;text-align:center;'>Fechas solicitadas</p>      
      <p style="width: 85%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">
      
      ${fechasATexto(permiso.fechas)}
      
      
      
      </p>
    </div>   

    <div style="text-align: center; line-height: 10px;">
      <p style="font-weight: bold;">Fecha de solicitud: <span style="font-weight: normal;"> ${formatearFecha(permiso.fechaCreacion.toISOString().split('T')[0])} </span></p>
      <p style="font-weight: bold;">Turno: <span style="font-weight: normal;"> ${permiso.creador.turno}</span></p>
      <p style="font-weight: bold;">Tarjeta No. <span style="font-weight: normal;">${permiso.creador.tarjeta}</span></p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center;">Firma del solicitante</p>
    </div>
    <div style="display:-webkit-flex;  -webkit-flex-justify-content: space-around;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-left:1cm;">Jefe inmediato</p>
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-left:10cm;">Jefe de Recursos Humanos</p>
    </div>
   </div>   



   
   <!--              Segunda papeleta                                          -->



  <div style="border:1px solid black;">

    <div style="display: -webkit-flex; -webkit-flex-direction: row;">
    <img src='${img}' alt="logo-hospital" width="80" height="80" style="display: inline; margin-left: 15px; margin-top: 10px;float:left;">
   
     
      <div  style="display: inline; font-size: 20px; margin-left: 4cm; text-align: center; line-height: 1px; ">
        <p style="font-size:18px;">Secretaria de salud de Michoacan</p>
        <p style="font-size:18px;">Hospital Psiquiatrico</p>
        <p style="font-size:18px;">Dr. Jose Torres Orozco</p>
        <p style="font-size:18px;">Morelia, michoacan</p>
      </div>
    </div>
    <h1 style="font-size: 20px; text-align: center; margin-top: 5px;">Solicitud de permiso o vacaciones</h1>
  
    <div style="line-height: 8px;">
      <p style="font-weight: bold; font-size:18px; margin-left:20px;">Nombre del empleado: <span style="font-weight: normal;"> ${permiso.creador.nombre}</span></p>
      <p style="font-weight: bold; font-size:18px; margin-left:20px;">Departamento de adscripcion: <span style="font-weight: normal;"> ${permiso.creador.departamento}</span></p>
      <p style="font-weight: bold; font-size:18px; margin-left:20px; margin-left:20px; text-decoration: underline;">Permiso solicitado: <span style="font-weight: normal; "> ${permiso.concepto}</span></p>
    </div>
   
    
    <div style="line-height: 16px;">
      <p style ='font-weight: bold; font-size: 16px; text-align:center;'>Descripcion</p>
      <p style="width: 85%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">${permiso.notas}</p>
    </div>

    <div style="line-height: 16px;">
      <p style ='font-weight: bold; font-size: 16px;text-align:center;'>Fechas solicitadas</p>      
      <p style="width: 85%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">
      
      ${fechasATexto(permiso.fechas)}
      
      
      
      </p>
    </div>   

    <div style="text-align: center; line-height: 10px;">
      <p style="font-weight: bold;">Fecha de solicitud: <span style="font-weight: normal;"> ${formatearFecha(permiso.fechaCreacion.toISOString().split('T')[0])} </span></p>
      <p style="font-weight: bold;">Turno: <span style="font-weight: normal;"> ${permiso.creador.turno}</span></p>
      <p style="font-weight: bold;">Tarjeta No. <span style="font-weight: normal;">${permiso.creador.tarjeta}</span></p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center;">Firma del solicitante</p>
    </div>
    <div style="display:-webkit-flex;  -webkit-flex-justify-content: space-around;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-left:1cm;">Jefe inmediato</p>
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-left:10cm;">Jefe de Recursos Humanos</p>
    </div>
   </div>   
   





   </html>  
  `;

  const options = {
    format: 'letter',
  }


  const stream = await generarPDF(content, options);
  res.contentType('application/pdf');

  stream.pipe(res, { end: true });
}


const obtenerDatosGeneralesPermisos = async (req, res) => {


  const primerDiaMes = obtenerFechaInicioDeMes()
  const ultimoDiaMes = obtenerFechaFinDeMes()
  const primerDiaAnio = obtenerFechaInicioAnio();
  const ultimoDiaAnio = obtenerFechaFinAnio();
  

  const [pasesSalida, economicos] = await Promise.all([


    // TODO: consulta no regresa el primer registro del primer dia del mes
    Permiso
      .where('creador').equals(req.usuario)
      .where('concepto').equals('Pase de salida sin retorno')
      .where('eliminado').equals(false)
      .find({ fechas: { $gte: primerDiaMes, $lte: ultimoDiaMes } }).countDocuments(),

    // TODO: consulta no regresa todos los permisos del anio   
    Permiso.where('creador').equals(req.usuario)
      .where('concepto').equals('Permiso economico')
      .where('eliminado').equals(false)
      .find({ fechas: { $gte: primerDiaAnio, $lte: ultimoDiaAnio } })
  ]);

  let totalEconomicos=0;
  economicos.forEach(economico => {
    totalEconomicos+=economico.fechas.length
  });

  res.json({ pasesSalida, economicos: totalEconomicos });

}


export {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso,
  descargarPermisoPDF,
  obtenerDatosGeneralesPermisos
}