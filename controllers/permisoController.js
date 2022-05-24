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
  const permisos =
    await Permiso.find().sort({ 'createdAt': -1 }).where('creador').
      equals(req.usuario).where('eliminado').equals(false)


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

const descargarPermisoPDF = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.usuario;
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

  // const stream = res.writeHead(200,{
  //   'Content-Type':'application/pdf',
  //   'Content-Disposition':'attachment; filename=permiso.pdf',
  // });

  // generarPDF(
  //   (chunk)=> stream.write(chunk),
  //   ()=> stream.end()
  // )

  // let permisotemp = {...permiso._doc};
  // console.log(permisotemp);


  // https://picsum.photos/600/400
  //  <img src="https://picsum.photos/600/400" alt="logo"  width="100" height="100" style="display: inline; margin-left: 5px; margin-top: 10px;float:left;"/>


  // const fechaCreacion = formatearFechaCompleta(new Date(permiso.fechaCreacion));


  const cwd = process.cwd();
    const base = `file:///${cwd}\\public\\img'`;
    console.log(base)

  const content = `
  <div style="
  border: 1px solid black;
  background-color: aliceblue;">

    <div style="display: -webkit-flex; -webkit-flex-direction: row;">
    <img src="https://scontent-dfw5-1.xx.fbcdn.net/v/t1.6435-9/152156158_109174567885130_7119807418647339106_n.png?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=VtdKeRq8814AX9vUf2z&_nc_ht=scontent-dfw5-1.xx&oh=00_AT9Q87fx6UwyDj1QR4lPlFxP-TidTn3BhI2DVs3cA06BMA&oe=62AD5D5D" alt="logo-hospital" width="100" height="100" style="display: inline; margin-left: 15px; margin-top: 10px;float:left;">
    <img src="${base}\\psiq.png" width="200" height"100"/>
   
     
      <div  style="display: inline; font-size: 20px; margin-left: 2cm; text-align: center; line-height: 2px; ">
        <p>Secretaria de salud de Michoacan</p>
        <p>Hospital Psiquiatrico</p>
        <p>Dr. Jose Torres Orozco</p>
        <p>Morelia, michoacan</p>
      </div>
    </div>
    <h1 style="font-size: 24px; text-align: center; margin-top: 50px;">Solicitud de permiso o vacaciones</h1>
  
    <div>
      <p style="font-weight: bold; font-size:22px; margin-left:20px;">Nombre del empleado: <span style="font-weight: normal;"> ${permiso.creador.nombre}</span></p>
      <p style="font-weight: bold;font-size:22px; margin-left:20px;">Departamento de adscripcion: <span style="font-weight: normal;"> ${permiso.creador.departamento}</span></p>
    </div>
    <div>
      <p style="font-weight: bold; font-size: 22px; margin-left:24px; margin-left:20px; text-decoration: underline;">Permiso solicitado: <span style="font-weight: normal; "> ${permiso.concepto}</span></p>
    </div>
    <div>
      <p style ='font-weight: bold; font-size: 20px; text-align:center;'>Descripcion</p>
      <p style="width: 70%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">${permiso.notas}</p>
    </div>

    <div>
      <p style ='font-weight: bold; font-size: 20px;text-align:center;'>Fechas solicitadas</p>
      
      <p style="width: 70%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">
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
    <div style="text-align: center; margin-top: 30px;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center;">Firma del solicitante</p>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-left:5cm;">Jefe inmediato</p>
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