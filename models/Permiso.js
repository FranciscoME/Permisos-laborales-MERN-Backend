import mongoose from "mongoose";


const permisoSchema = new mongoose.Schema({
  concepto:{
    type: String,
    required:true,
    trim:true
  },
  notas:{
    type:String,
    required:false,
    trim:true
  },
  // fechaInicio:{
  //   type:Date,
  //   required:true,
  //   default:Date.now()
  // },
  // fechaFinal:{
  //   type:Date,
  //   required:true,
  //   default:Date.now()
  // },
  fechaCreacion:{
    type:String,
    
  // required:true,
    default:Date.now()
  },
  fechas:[{
    type:String,
  }],
  creador:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Usuario'
  },
  eliminado:{
    type:Boolean,
    default:false
  }
},
{
  timestamps:true,
}
)

const Permiso = mongoose.model("Permiso", permisoSchema);
export default Permiso;