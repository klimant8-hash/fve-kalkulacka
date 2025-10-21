import { useEffect, useState } from "react";
import KalkulackaForm from "../components/KalkulackaForm";

export default function Home(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const u = localStorage.getItem("user");
    if (!u) window.location.href = "/login";
    else setUser(u);
  },[]);

  if (!user) return <p>Načítavam…</p>;
  return (
    <div style={{padding:20}}>
      <h1>FVE kalkulačka</h1>
      <p>Prihlásený: <b>{user}</b></p>
      <KalkulackaForm user={user} />
    </div>
  );
}
