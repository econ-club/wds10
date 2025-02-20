import ExcelJS from 'exceljs';
import fs from 'fs';

async function convertExcelToJson() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("../assets/news.xlsx");  // Ensure "news.xlsx" is in the same folder
    const worksheet = workbook.getWorksheet(1); // Assuming the first sheet has the data

    const newsByRound = {};

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const round = row.getCell(1).value; // Assuming "Round" is in the first column
        const news = row.getCell(2).value;  // Assuming "News" is in the second column

        if (!newsByRound[round]) {
            newsByRound[round] = [];
        }
        newsByRound[round].push(news);
    });

    // Save JSON to a file
    fs.writeFileSync("news.json", JSON.stringify(newsByRound, null, 2));
    console.log("Excel converted to JSON successfully!");
}

convertExcelToJson();
