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


export  {formatearFecha, formatearFechaCompleta};