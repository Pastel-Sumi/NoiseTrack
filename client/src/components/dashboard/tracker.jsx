
import Audio from "./audio";
import { Chart } from "./monitoreo";

function Tracker() {
  return (
    <div>
      <section className="justify-center items-center">
        <h1 className="flex text-5xl py-2 font-bold justify-center">Transmisión de video y decibeles</h1>
        <div className="flex justify-center">
          <Chart/>
        </div>
      </section>
  </div>
  );
}

export default Tracker;