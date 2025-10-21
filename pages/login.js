import { useState } from "react";
import { verifyUser } from "../lib/users";

export default function Login(){
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  function handle(e){
    e.preventDefault();
    if (verifyUser(username, password)) {
      localStorage.setItem("user", username);
      window.location.href = "/";
    } else {
      setError("Nesprávne meno alebo heslo");
    }
  }

  return (
    <div style={{maxWidth:380, margin:"40px auto", padding:20, border:"1px solid #eee", borderRadius:12}}>
      <h2>Prihlásenie</h2>
      <form onSubmit={handle}>
        <label>Meno</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} required />

        <label>Heslo</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        {error && <p style={{color:"crimson"}}>{error}</p>}
        <button type="submit" style={{marginTop:12}}>Prihlásiť</button>
      </form>
    </div>
  );
}
