const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function mergePDFs(p1,p2,output){
	//load the first pdf
	const pdf1Bytes = fs.readFileSync(p1);
	const pdf1 = await PDFDocument.load(pdf1Bytes);
	
	//load the second pdf
	
	const pdf2Bytes = fs.readFileSync(p2);
	const pdf2 = await PDFDocument.load(pdf2Bytes);

	//create a new pdfdocument
	
	const mergedPdf = await PDFDocument.create();

	//add the pages from the first pdf 
	const pdf1Pages = await mergedPdf.copyPages(pdf1,pdf1.getPageIndices());
	pdf1Pages.forEach(page =>{
		mergedPdf.addPage(page);
	});

	const pdf2Pages = await mergedPdf.copyPages(pdf2,pdf2.getPageIndices());
	pdf2Pages.forEach(page => {
		mergedPdf.addPage(page);

	});

	const mergedPdfBytes = await mergedPdf.save();

	fs.writeFileSync(output,mergedPdfBytes);

}

mergePDFs('/home/arch/Desktop/client_project/ups/screen.pdf','/home/arch/Desktop/client_project/ups/1.pdf','merged.pdf');
