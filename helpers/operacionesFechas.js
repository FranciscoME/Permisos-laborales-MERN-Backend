
const obtenerFechaInicioDeMes = () => {
	const fechaInicio = new Date();
	// Iniciar en este año, este mes, en el día 1
	return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
};


const obtenerFechaFinDeMes = () => {
	const fechaFin = new Date();
	// Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
	return new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
};


const obtenerFechaInicioAnio = () => {
	return new Date(new Date().getFullYear(), 0, 1);
};

const obtenerFechaFinAnio = () => {
	return new Date(new Date().getFullYear(), 11, 31);
};

export {
  obtenerFechaInicioDeMes,
  obtenerFechaFinDeMes,
	obtenerFechaInicioAnio,
	obtenerFechaFinAnio
}