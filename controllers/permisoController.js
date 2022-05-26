import { generarPDF } from "../helpers/generarPDF.js";
import Permiso from "../models/Permiso.js";
import pdf from 'html-pdf';
import { formatearFecha, formatearFechaCompleta } from "../helpers/formatearFecha.js";
// import PDFDocument from 'pdfkit'
import path from "path";
import fs from "fs";


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
  console.log('obtener permisos:')
  console.log(req.query)
  // const {limite=1, desde=0} = req.query;
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 5;
  console.log(desde)
  console.log(limite)

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
  console.log('En imprimir recibo!!!!!!!!')
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


  const cwd = process.cwd();
  const base = `file://${cwd}/assets/psiq.png`;
  let img = path.normalize(base);
  const content = `
  <html style="zoom: 0.75;
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
      ${permiso.fechas.map(fecha => (
    `<span> ${formatearFecha(fecha)}</span>`
  ))
    }
      
      </p>
    </div>   

    <div style="text-align: center; line-height: 10px;">
      <p style="font-weight: bold;">Fecha de solicitud: <span style="font-weight: normal;"> ${formatearFecha(permiso.fechaCreacion)} </span></p>
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





  <div style="
  border: 1px solid black;
  background-color: aliceblue;">

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
      ${permiso.fechas.map(fecha => (
      `<span> ${formatearFecha(fecha)}</span>`
    ))
    }
      
      </p>
    </div>   

    <div style="text-align: center; line-height: 10px;">
      <p style="font-weight: bold;">Fecha de solicitud: <span style="font-weight: normal;"> ${formatearFecha(permiso.fechaCreacion)} </span></p>
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



  

  


  
  `;

  const options = {
    format: 'letter',
  }


  // pdf.create(content).toFile('./html-pdf.pdf', function (err, res) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(res);
  //   }
  // });

  // res.sendFile('./html-pdf.pdf' , { root : __dirname});

  // return new Promise((resolve, reject) => {
  const stream = await generarPDF(content, options);
  res.contentType('application/pdf');

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-disposition': `attachment; filename=test.pdf`,
  });

  stream.pipe(res, { end: true });




}


export {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso,
  descargarPermisoPDF
}