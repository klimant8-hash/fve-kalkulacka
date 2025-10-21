import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,          // multiline OK
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
    await doc.loadInfo();

    // použijeme list "Quotes" (ak neexistuje, vytvoríme so základnými hlavičkami)
    let sheet = doc.sheetsByTitle["Quotes"];
    if (!sheet) {
      sheet = await doc.addSheet({
        title: "Quotes",
        headerValues: ["Datum","Obchodnik","RocnaSpotreba_kWh","Faza","Menic","CenaSpolu"]
      });
    }

    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    await sheet.addRow(data);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
