import { Link } from "react-router-dom";

function HomePage() {
  return (
  <section className="bg-red-500 flex justify-center items-center">
    <header className="bg-zinc-800 p-10">
      <h1 className="text-5xl py-2 font-bold">NoiseTrack</h1>
      <p className="text-md text-slate-400">
        Software orientado al seguimiento de riesgos auditivos en trabajadores expuestos a ambientes 
        laborales que presentan altos niveles de ruido. Implementa inteligencia 
        artificial para monitorear el uso del equipo de protección auditivo en tiempo real. 
      </p>

      <Link
        className="bg-zinc-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
        to="/login"
      >
        Iniciar sesión
      </Link>
    </header>
  </section>
  );
}

export default HomePage;
