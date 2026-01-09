import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js"; // use "legacy" after installing version 2.x

async function readPdf(filePath) {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    console.log("Extracted text:\n", fullText);
  } catch (err) {
    console.error("Failed to read PDF:", err);
  }
}

// Change to your PDF path
readPdf("C:/Users/super/Downloads/random_paragraph.pdf");
