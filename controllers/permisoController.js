import { generarPDF } from "../helpers/generarPDF.js";
import Permiso from "../models/Permiso.js";
import pdf from 'html-pdf';
import PDFDocument from 'pdfkit'



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

const descargarPermisoPDF = async (req, res) => {
  const { id } = req.params;
  const {nombre}=req.usuario;
  console.log('En imprimir recibo!!!!!!!!')
  // const stream = res.writeHead(200,{
  //   'Content-Type':'application/pdf',
  //   'Content-Disposition':'attachment; filename=permiso.pdf',
  // });

  // generarPDF(
  //   (chunk)=> stream.write(chunk),
  //   ()=> stream.end()
  // )

  
  const content = `
  <div style="
  border: 1px solid black;
  background-color: aliceblue;">

    <div style="display:flex">
      <img src="https://picsum.photos/600/400" alt="logo"  width="100" height="100" style="display: inline; margin-left: 5px; margin-top: 10px;"/>
      <div  style="display: inline; font-size: 20px; margin-left: 4cm; text-align: center; line-height: 2px;">
        <p>Secretaria de salud de michoacan</p>
        <p>Hospital Psiquiatrico</p>
        <p>Dr. Jose Torres Orozco</p>
        <p>Morelia, michoacan</p>
      </div>
    </div>
    <h1 style="font-size: 20px; text-align: center;">Solicitud de permiso o vacaciones</h1>
  
    <div>
      <p style="font-weight: bold;">Nombre del empleado: <span style="font-weight: normal;"> Francisco Roberto Hernandez De la torre</span></p>
      <p style="font-weight: bold;">Departamento de adscripcion: <span style="font-weight: normal;"> Enfermeria</span></p>
    </div>
    <div>
      <p style="font-weight: bold; font-size: 22px;">Permiso solicitado: <span style="font-weight: normal;"> Vacaciones C-30</span></p>
    </div>
    <div>
      <p style ='font-weight: bold; font-size: 20px;'>Descripcion:</p>
      <p style="width: 70%; height: auto; border: 1px solid black; margin-left:auto ; margin-right: auto;">Solicito por asuntos personales</p>
    </div>

    <div style="text-align: center; line-height: 10px;">
      <p style="font-weight: bold;">Fecha: <span style="font-weight: normal;"> 10/12/22</span></p>
      <p style="font-weight: bold;">Turno: <span style="font-weight: normal;"> Matutino</span></p>
      <p style="font-weight: bold;">Tarjeta No. <span style="font-weight: normal;">000</span></p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center;">Firma del solicitante</p>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <p style="border-top: 1px solid black; display:inline-block; text-align: center;">Jefe inmediato</p>
      <p style="border-top: 1px solid black; display:inline-block; text-align: center; margin-right:-1px">Jefe de Recursos Humanos</p>
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
    const stream = await generarPDF(content,options);
    res.contentType('application/pdf');
    stream.pipe(res);
  // });




  // pdf kit

  // const stream = res.writeHead(200, {
  //   'Content-Type': 'application/pdf',
  //   'Content-Disposition': 'attachment;filename=permiso.pdf',
  // });

  // generarPDF((chunk) => stream.write(chunk), () => stream.end());



}


export {
  nuevoPermiso,
  obtenerPermisos,
  obtenerPermiso,
  modificarPermiso,
  eliminarPermiso,
  descargarPermisoPDF
}