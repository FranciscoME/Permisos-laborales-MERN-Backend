import Usuario from "../models/Usuario.js";
import generarId from '../helpers/generarId.js';
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usario ya existe");
    return res.status(400).json({ msg: error.message });
  }


  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();
    // res.json(usuarioAlmacenado);

    res.json({msg:'Usuario creado correctamente'})


  } catch (error) {
    console.log(error);
  }

};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado

  // if(!usuario.confirmado){
  //   const error = new Error('El usuario no ha sido confirmado');
  //   return res.status(403).json({msg:error.message});
  // }


  // Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    })
  }
  else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message })
  }

}

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error('El token no valido');
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error)
  }

}

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({ msg: "Se ha enviado un correo para restablecer la contraseña" });
  } catch (error) {
    console.log(error)
  }

}

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "token valido y el usuario existe" });
  }
  else {
    const error = new Error('El token no valido');
    return res.status(404).json({ msg: error.message });
  }

}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "password modificado correctamente" }); 
      
    } catch (error) {
      console.log(error)
    }
  }
  else {
    const error = new Error('El token no valido');
    return res.status(404).json({ msg: error.message });
  }

}


const obtenerUsuario = async (req,res)=>{

  const {id} = req.params

  const usuario = await Usuario.findById(id).select('-password -token -confirmado -rol -__v -createdAt -updatedAt');

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (usuario._id.toString() !== id) {
    const error = new Error('No tienes los permisos necesarios');

    return res.status(404).json({ msg: error.message });

  }

  // console.log(usuario);
  res.status(200).json(usuario);

}


const perfil = async (req, res) => {
  const {usuario}= req;
  res.json(usuario);
}

const actualizarUsuario = async (req, res) => {
  // Evitar registros duplicados
  const { nombre,password,email,departamento,rol,turno,tarjeta,_id } = req.body;
  console.log(req.body);

  try {
    const UsuarioDb = await Usuario.findById(_id);
    // console.log(existeUsuario)
    if (!UsuarioDb) {
      const error = new Error("No existe el usuario");
      return res.status(400).json({ msg: error.message });
    }
  
    if (UsuarioDb._id.toString() !== _id) {
      const error = new Error('No tienes los permisos necesarios');
  
      return res.status(404).json({ msg: error.message });
    }
  
    UsuarioDb.nombre =nombre || UsuarioDb.nombre;
    UsuarioDb.email = email || UsuarioDb.email;
    UsuarioDb.departamento = departamento || UsuarioDb.departamento;
    UsuarioDb.rol = rol || UsuarioDb.rol;
    UsuarioDb.turno = turno || UsuarioDb.turno;
    UsuarioDb.tarjeta = tarjeta || UsuarioDb.tarjeta;
    
    const usuarioGuardado = await UsuarioDb.save();

    res.json(usuarioGuardado);
    
  } catch (error) {
    return res.status(500).json({ msg: error.message });  
  }
  
  
 

};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  obtenerUsuario,
  actualizarUsuario
};