import { useState } from "react";
import { appendOffer } from "../lib/sheets";

export default function KalkulackaForm({ user }){
  const [spotreba,setSpotreba]=useState("");
  const [faza,setFaza]=useState("1F");
  const [menic,setMenic]=useState("");
  const [loading,setLoading]=useState(false);
  const [vysledok,setVysledok]=useState(null);
  const [error,setError]=useState("");

  async function handleCompute(e){
    e.preventDefault();
    setError(""); setLoading(true);
    try{
      const kWh = Number(spotreba || 0);
      const cena = (kWh) * (faza === "3F" ? 0.23 : 0.19); // placeholder
      const data = {
        Datum: new Date().toISOString(),
        Obchodnik: user,
        RocnaSpotreba_kWh: kWh,
        Faza: faza,
        Menic: menic || "-",
        CenaSpolu: cena.toFixed(2)
      };
      await appendOffer(data);
      setVysledok(data);
    }catch(err){
      setError(String(err));
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleCompute}>
        <label>Ročná spotreba (kWh)</label>
        <input value={spotreba} onChange={e=>setSpotreba(e.target.value)} required />

        <label>Fáza</label>
        <select value={faza} onChange={e=>setFaza(e.target.value)}>
          <option value="1F">1F</option>
          <option value="3F">3F</option>
        </select>

        <label>Menič (dočasne ručný výber)</label>
        <input value={menic} onChange={e=>setMenic(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? "Počítam..." : "Uložiť ponuku"}
        </button>
      </form>

      {error && <p style={{color:"crimson"}}>{error}</p>}
      {vysledok && <pre>{JSON.stringify(vysledok, null, 2)}</pre>}
      <style jsx>{`
        .card { border:1px solid #e5e5e5; border-radius:12px; padding:16px; max-width:540px; }
        label { display:block; margin-top:10px; font-size:12px; color:#555; }
        input,select { width:100%; padding:8px; }
        button { margin-top:14px; padding:10px 14px; background:#111; color:#fff; border:0; border-radius:8px; }
      `}</style>
    </div>
  );
}
