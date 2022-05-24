import pdf from 'html-pdf';
// import PDFDocument from 'pdfkit';



const generarPDF = (contentpdf) => {


  

    return new Promise((resolve, reject) => {
    pdf.create(contentpdf).toStream((err, stream) => {
      if (err) {
        return reject(err);
      }

      
      
      resolve(stream);
    });
  });


}

export { generarPDF };