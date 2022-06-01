const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha.split('-'));

  const opciones = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }

  return nuevaFecha.toLocaleDateString(nuevaFecha, opciones);
}

const formatearFechaCompleta = (fecha) => {
  const nuevaFecha = new Date(fecha.split('T')[0].split('-'));


  const opciones = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }

  return nuevaFecha.toLocaleDateString(nuevaFecha, opciones);
}


const fechasATexto = (fechas)=>{
  console.log('modificarFecha: ',fechas[0].toISOString().split('T')[0]);
  // toISOString().split('T')[0]

  const meses = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ]
  const dias=['D','L','Ma','Mi','J','V','S']
  
  
  let mesPosicionAnterior=fechas[0].toISOString().split('T')[0].split('-')[1];
  let textoFechas='';
  fechas.forEach((fecha,index)=>{
     let diaFecha = new Date(fecha).getDay();
      let mes= fecha.toISOString().split('T')[0].split('-')[1]
      let dia = fecha.toISOString().split('T')[0].split('-')[2]
      let anio = fecha.toISOString().split('T')[0].split('-')[0]
      if(mesPosicionAnterior===mes){
      textoFechas +=  dias[diaFecha] +' '+ dia +', '
      }else{
         textoFechas +=' de '+meses[mes-2]+' ' +anio +' ' ;
         textoFechas +=  dias[diaFecha]+' '+dia+', '
      }
      if((fechas.length-1)===index){
         textoFechas+='de '+meses[mes-1] +' '+anio
      }
      mesPosicionAnterior=mes;
    }
  )

return textoFechas
}

export  {formatearFecha, formatearFechaCompleta,fechasATexto};