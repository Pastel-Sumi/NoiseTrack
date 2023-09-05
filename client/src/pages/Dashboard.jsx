import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar/>
      <section className="flex justify-center items-center">
        
        <header className="bg-zinc-800 p-10">
          <h1 className="text-5xl py-2 font-bold">Gráfica de ruidos</h1>

        </header>
      </section>
  </div>
  );
}

export default Dashboard;
