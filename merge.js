const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function merge(p,output){
	//load the first pdf
	
	const mergedPdf = await PDFDocument.create();
	for (let p1 of p){
		console.log(p1);
		const pdfBytes = fs.readFileSync(p1);
		const pdf = await PDFDocument.load(pdfBytes);

		//add the pages from the first pdf 
		const pdfPages = await mergedPdf.copyPages(pdf,pdf.getPageIndices());
		pdfPages.forEach(page =>{
			mergedPdf.addPage(page);
		});
	}
	const mergedPdfBytes = await mergedPdf.save();

	fs.writeFileSync(output,mergedPdfBytes);

}

exports.merge = merge;
