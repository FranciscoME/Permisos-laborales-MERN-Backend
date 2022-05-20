import pdf from 'html-pdf';
import PDFDocument from 'pdfkit';



const generarPDF = (contentpdf) => {

  const content = `
  <h1>Título en el PDF creado con el paquete html-pdf</h1>
  <p>Generando un PDF con un HTML sencillo</p>
  `;


  //   pdf.create(content).toFile('./html-pdf.pdf', function(err, res) {
  //       if (err){
  //           console.log(err);
  //       } else {
  //           console.log(res);
  //       }
  //   });

  // pdf.create(content).toStream( function(err, stream){
  //     if (err){
  //         console.log(err);
  //     } else {
  //         console.log(stream);
  //     }
  // });



  //   return pdf;


  return new Promise((resolve, reject) => {
    pdf.create(contentpdf).toStream((err, stream) => {
      if (err) {
        return reject(err);
      }
      resolve(stream);
    });
  });

  // kitpdf

  // const doc = new PDFDocument();
  // doc.on('data',dataCallback);
  // doc.on('end',endCallback);
  // doc.fontSize(25).text('Hola mundo!');
  // doc.end();


  // return doc;



}

export { generarPDF };