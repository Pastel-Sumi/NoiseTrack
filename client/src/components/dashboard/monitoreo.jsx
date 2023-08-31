import ReactEcharts from "echarts-for-react"
import React, { useState, useEffect } from 'react';
import { saveRequest } from "../../api/decibel";
import cloneDeep from 'lodash.clonedeep';
import { Button } from "../ui";


let flag = true;
let algo;
let data;
let superData = [];
let micV;
let now2 = new Date().getTime();
let limite = 300;
const oneDay = 24 * 3600 * 1000;
const highValuesSeries = [];
let rango = 5 * 60 * 1000;
let intervalo = 1000;
let showChart = false;
let isAudioInitialized =false;
let intervalo_tiempo_precaucion = 10;
let intervalo_tiempo_aviso = 20;
let limite_text = "en los últimos 5 minutos.";
let titulo = "Gráfico de decibeles 5 minutos";
let intervaloTiempoPrecaucion = 60;
let intervaloTiempoAviso = 120;

//Envio de datos BD
let intervaloSend = 1000
let decibel={};

    // Función para obtener el valor del micrófono
  function obtenerValorDelMicrofono() {
      if(micV === null){
        micV = 0;
      }
      return micV;
  }

  function randomData() {
    let now3 = new Date().getTime();
    now2 = ( now2 + 1000);
    // Reemplaza el valor aleatorio con el valor del micrófono
    var micValue = obtenerValorDelMicrofono(); // Debes implementar esta función
    return {
      name: now2,
      value: [[now2], micValue]
    };
  }
  
  function cargarValores() {
    if(flag){
      console.log("entro")
      var micValue = obtenerValorDelMicrofono();
      for (var i = 0; i < 14400; i++) {
        superData.push(randomData());
      }
      data =  superData.slice(-limite);
      flag = false;
      showChart = true;
    }
  }
  cargarValores()

export function Chart() {
  
  
  let value;
  const [localDbValues, setLocalDbValues] = useState([]);
  const refreshRate = 500;
  const color = 'green';
  const [stream, setStream] = useState(null);
  let offset;
  const [date, setDate] = useState(null);
  let rmss;
  let rms =0;
  const [volume, setVolume] = useState(null);
  const [limiteText, setLimiteText] = useState("en los últimos 5 minutos");
  let audioStream;
  
  const [intervaloId, setIntervaloId] = useState(null);
  let intervalId;
  var micValue = obtenerValorDelMicrofono();



  const toggleRangoButton_5M = () => {
      titulo = 'Gráfico de decibeles 5 minutos';
      limite = 300;
      intervaloTiempoPrecaucion = 60;
      intervaloTiempoAviso = 120;
      intervalo = 1000;
      rango = 5 * 60 * 1000;
      limite_text = "en los últimos 5 minutos.";
      clearInterval(intervalId);
      //ejecutarIntervalo();
    };

  const toggleRangoButton_30M = () => {
      titulo = 'Gráfico de decibeles 30 minutos';
      limite = 300 * 6;
      intervaloTiempoPrecaucion = 60 * 3;
      intervaloTiempoAviso = 60 * 5;
      intervalo = 1000;
      rango =30 * 60 * 1000;
      limite_text = 'en los últimos 30 minutos.';
      clearInterval(intervalId);
      //ejecutarIntervalo();
    };

    const toggleRangoButton_1H = () => {
      titulo = 'Gráfico de decibeles 1 hora';
      limite = 3600;
      intervaloTiempoPrecaucion = 720;
      intervaloTiempoAviso = 900;
      intervalo = 1000;
      rango = 2 * 30 * 60 * 1000;
      limite_text = 'en la última hora.';
      clearInterval(intervalId);
      //ejecutarIntervalo();
    };

   const toggleRangoButton_4H = () => {
      titulo = 'Gráfico de decibeles 4 horas';
      limite = 14400;
      intervaloTiempoPrecaucion = 2880;
      intervaloTiempoAviso = 3600;
      intervalo = 1000;
      rango = 4 * 2 * 30 * 60 * 1000;
      limite_text = 'en las últimas 4 horas.';
      clearInterval(intervalId);
      //ejecutarIntervalo();
    };
  function initializeAudio() {
        if (!isAudioInitialized) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                audioStream = stream;
                startAudioProcessing(audioStream);
                isAudioInitialized = true;
            })
            .catch((error) => {
                console.error('Error al obtener permiso para el micrófono:', error);
            });
        }
  }


  
  function startAudioProcessing(audioStream) {
        const context = new AudioContext();
        const source = context.createMediaStreamSource(audioStream);

        const processor = context.createScriptProcessor(2048, 1, 1);
        const analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 256;

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = () => {
            let datas = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(datas);
            rms = 0;

            for (var i = 0; i < datas.length; i++) {
                if (datas[i] > 120) datas[i] = 120
                rms += datas[i] * datas[i]
            }
            rms = Math.sqrt(rms / datas.length);
            rmss = rms;
            offset = 0;
            value = rms + offset;

            micV = rms;

            //Convierte RMS a decibeles
            let db = 20 * Math.log10(Math.abs(rms)) * 2

            localDbValues.push(value);
            // Actualizar la variable global micV con el valor del micrófono
            micV = db;
          };
  }
  function contarValoresMayoresA20(data) {
        return data.reduce((count, item) => {
            // Supongo que el valor que deseas verificar está en item.value[1]
            if (item.value[1] > 20) {
                return count + 1;
            }
            return count;
        }, 0);
    }

    const saveDecibel = async () => {
      console.log("decibel",decibel)
      setInterval(async function () {
        try {
            await saveRequest(decibel).then(res => {
              if (res.status === 200) {
                  console.log(res.data)
                  console.log("Decibel enviado");
                }
            }    
          )} catch (error) {
            console.log(error.response);
          }
      }, intervaloSend);
};

  useEffect(() => {
    initializeAudio();
    saveDecibel();
    ejecutarIntervalo();
    }, []);




  const DEFAULT_OPTIONN ={
      title: {
        text:  titulo
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var date = params.name;
          return date + ' : ' + params.value[1];
        },
        axisPointer: {
          animation: true
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        }
      },
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          showSymbol: false,
          data: data
        },
          {
            name: 'High Values',
            type: 'scatter', // Usar un gráfico de dispersión para los valores altos
            data: highValuesSeries,
            symbolSize: 12, // Tamaño del símbolo
        }
      ]
    };
  const [option, setOption] = useState(DEFAULT_OPTIONN);
  
 // const [option, setOption] = useState(DEFAULT_OPTION);

     function actualizarAviso() {
      const avisoElement = document.getElementById('aviso');
      const conteo = contarValoresMayoresA20(data);

      const minutos = Math.floor(conteo / 60);
      const segundos = conteo % 60;
      console.log(data.length,intervaloTiempoAviso,  conteo, intervaloTiempoPrecaucion)

      if (conteo > intervaloTiempoAviso) {
        avisoElement.classList.remove('amarillo');
        avisoElement.classList.add('rojo');
        avisoElement.textContent = `Aviso: se han sobrepasado los 85 decibeles durante ${minutos} minutos y ${segundos} segundos, ${limite_text}`;
      } else if (conteo > intervaloTiempoPrecaucion) {
        avisoElement.classList.remove('rojo');
        avisoElement.classList.add('amarillo');
        avisoElement.textContent = `Precaución: se han sobrepasado los 85 decibeles durante ${minutos} minutos y ${segundos} segundos, ${limite_text}`;
      } else {
        // Ocultar el aviso si el conteo es menor o igual a 60
        avisoElement.style.display = 'none';
      }

      // Ocultar el aviso si el conteo es menor o igual a 60
      if (conteo <= intervaloTiempoPrecaucion) {
        avisoElement.style.display = 'none';
      } else {
        avisoElement.style.display = 'block';
      }
    }




  function ejecutarIntervalo() {


    intervalId = setInterval(function () {
      let date =  new Date();
      console.log("entro")
      superData.shift(); // Eliminar el dato más antiguo
      superData.push(randomData()); // Agregar un nuevo dato
      data = superData.slice(-limite);
      decibel = {
          date:formatDate(date),
          db: data[data.length-1].value[1],
          place: "Galpon 1"
      }

      actualizarAviso();
      //console.log(data);
      //updateElapsedTime();

      setOption({
        title: {
          text:  titulo
        },
        xAxis: {
          min: now2 - rango,
          max: now2
        },
        visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 120,
          inRange: {
            // The visual configuration in the selected range
            color: ['blue','green', 'yellow','orange' ,'red'], // A list of colors that defines the graph color mapping
            // the minimum value of the data is mapped to 'blue', and
            // the maximum value is mapped to 'red', // the maximum value is mapped to 'red', // the maximum value is mapped to 'red'.
            // The rest is automatically calculated linearly.
            //symbolSize: [30] // Defines the mapping range for the graphic size.
            // The minimum value of the data is mapped to 30, // and the maximum value is mapped to 100.
            // The maximum value is mapped to 100.
            // The rest is calculated linearly automatically.
          },
          outOfRange: {
            // Check the out of range visual configuration
            symbolSize: [30, 100]
          }
        },
        {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          dimension: 0,

        }
      ],
        series: [
          {
            data: data
          }
        ]
      });
    }, 1000);
  }

  function padTwoDigits(num) {
    return num.toString().padStart(2, "0");
  }
  
  function formatDate(date) {
    
    return (
      [
        date.getFullYear(),
        padTwoDigits(date.getMonth() + 1),
        padTwoDigits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTwoDigits(date.getHours()),
        padTwoDigits(date.getMinutes()),
        padTwoDigits(date.getSeconds()),
      ].join(":")
    );
  }

  return (

    <div>
    <div id="aviso" className="flex justify-center aviso amarillo">Aviso</div>

      {showChart && (
        <ReactEcharts
          option={option}
          style={{ width: "600px", height: "300px" }}
        />
      )}

      <div className="flex justify-center items-center">
        <Button onClick={toggleRangoButton_5M}> 5 Minutos</Button>
        <Button onClick={toggleRangoButton_30M}> 30 Minutos</Button>
        <Button onClick={toggleRangoButton_1H}> 1 Hora</Button>
        <Button onClick={toggleRangoButton_4H}> 4 Horas</Button>
      </div>

    </div>
  );
}

let myChart;
