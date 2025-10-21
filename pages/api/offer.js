import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // DÔLEŽITÉ: konverzia \n -> reálne nové riadky
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: privateKey, // tu ide už opravený kľúč
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
    await doc.loadInfo();

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
