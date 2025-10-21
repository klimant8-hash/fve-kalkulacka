import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);

export async function appendOffer(rowObj){
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["Quotes"] || doc.sheetsByTitle["NACENENIE"];
  if(!sheet) throw new Error("Sheet 'Quotes' or 'NACENENIE' not found");
  await sheet.addRow(rowObj);
  return true;
}
