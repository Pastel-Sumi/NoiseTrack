import ReactEcharts from "echarts-for-react"
import React, { useState, useEffect } from 'react';
//import { saveRequest } from "../../api/decibel";
//import cloneDeep from 'lodash.clonedeep';
import { Button } from "semantic-ui-react";
import { bd } from "../../../config";
import { collection, addDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { micro } from "../../../pages/Home/Home"

import io from 'socket.io-client';




let new_flag = true;
let flag = true;
let datos = 1;
let algo;
let data;
let data2;
let superData = [];
let superData2 = [];
let micV;
let micV2;
let now2 = new Date().getTime();
let limite = 300;
const oneDay = 24 * 3600 * 1000;
const highValuesSeries = [];
let rango = 5 * 60 * 1000;
let intervalo = 1000;
let showChart = false;
let isAudioInitialized = false;
let isAudioInitialized2 = false;
let intervalo_tiempo_precaucion = 10;
let intervalo_tiempo_aviso = 20;
let limite_text = "en los últimos 5 minutos.";
let titulo = "Gráfico de decibeles 5 minutos";
let intervaloTiempoPrecaucion = 60;
let intervaloTiempoAviso = 120;


//Envio de datos BD
let intervaloSend = 1000
let decibel = {};

const socket = io('http://localhost:6001');
//const socket2 = io('http://localhost:6002');


function enviarDecibel(decibeles){
  socket.emit('message',decibeles);
}

/*function enviarDecibel2(decibeles){
  socket2.emit('message',decibeles);
}*/
function v_datos(datos) {
  if (datos === 1) {
    return data;
  } else if (datos === 2) {
    return data2;
  }
}


// Función para obtener el valor del micrófono
function obtenerValorDelMicrofono(version) {
  if (version === 1) {
    if (micV === null || micV === undefined || micV === -Infinity) {
      micV = 0;
    }
    return micV;
  } else if (version === 0) {
    if (micV2 === null || micV2 === undefined || micV2 === -Infinity) {
      micV2 = 0;
    }
    return micV2;
  }
}

function randomData(version) {
  let now3 = new Date().getTime();

  var micValue = obtenerValorDelMicrofono(version);
  return {
    name: now2,
    value: [[now2], micValue]
  };
}

function cargarValores() {
  if (flag) {
    console.log("entro")
    var micValue = obtenerValorDelMicrofono();
    for (var i = 0; i < 14400; i++) {
      superData.push(randomData(1));
      superData2.push(randomData(0));
    }
    data = superData.slice(-limite);
    data2 = superData2.slice(-limite);
    flag = false;
    showChart = true;
  }
}
cargarValores()

export function Decibels() {

  let value;
  const [localDbValues, setLocalDbValues] = useState([]);
  const refreshRate = 500;
  const color = 'green';
  const [stream, setStream] = useState(null);
  let offset;
  const [date, setDate] = useState(null);
  let rmss;
  let rms = 0;
  const [volume, setVolume] = useState(null);
  const [limiteText, setLimiteText] = useState("en los últimos 5 minutos");
  let audioStream;
  let audioStream2;
  const audioInputDevices = {};

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
  const changeMicro = () => {
    if (datos === 1) {
      datos = 2;
    } else if (datos === 2) {
      datos = 1;
    }
  };

  const toggleRangoButton_30M = () => {
    titulo = 'Gráfico de decibeles 30 minutos';
    limite = 300 * 6;
    intervaloTiempoPrecaucion = 60 * 3;
    intervaloTiempoAviso = 60 * 5;
    intervalo = 1000;
    rango = 30 * 60 * 1000;
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
  function initializeAudio(version) {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          if (device.kind === 'audioinput') {
            audioInputDevices[device.deviceId] = {
              label: device.label,
              deviceId: device.deviceId
            };
          }
        });

        // Aquí, audioInputDevices contendrá los datos de los dispositivos de entrada de audio
        console.log('Datos de dispositivos de entrada de audio:', audioInputDevices);
      })
      .catch(error => {
        console.error('Error al enumerar dispositivos:', error);
      });
    if (version === 1) {
      if (!isAudioInitialized) {

        navigator.mediaDevices.getUserMedia({ audio: { deviceId: '96e8f94d0710d3e783c1187bc9fc1cf819f8bab8c86f3962da6f02ed517208d3' }, video: false })
          .then((stream) => {
            audioStream = stream;
            startAudioProcessing(audioStream, version);
            isAudioInitialized = true;
          })
          .catch((error) => {
            console.error('Error al obtener permiso para el micrófono:', error);
          });
      }
    } else if (version === 2) {
      if (!isAudioInitialized2) {
        navigator.mediaDevices.getUserMedia({ audio: { deviceId: '16054751c3722357e5534bdaa7a96b1c7fb4680aa9039e607cc878c4c3e7b19b' }, video: false })
          .then((stream) => {
            audioStream2 = stream;
            startAudioProcessing(audioStream2, version);
            isAudioInitialized2 = true;
          })
          .catch((error) => {
            console.error('Error al obtener permiso para el micrófono:', error);
          });
      }
    }
  }




  function startAudioProcessing(audioStream, version) {
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
      if (version === 1) {
        micV = rms;

        //Convierte RMS a decibeles
        let db = 20 * Math.log10(Math.abs(rms)) * 1.2

        localDbValues.push(value);
        // Actualizar la variable global micV con el valor del micrófono
        micV = db;
      }
      else if (version === 2) {
        micV2 = rms;

        //Convierte RMS a decibeles
        let db = 20 * Math.log10(Math.abs(rms)) * 1.2

        localDbValues.push(value);
        // Actualizar la variable global micV con el valor del micrófono
        micV2 = db;
      }
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
  function microfono_selec(datos) {
    if (datos === 1) {
      return audioInputDevices['96e8f94d0710d3e783c1187bc9fc1cf819f8bab8c86f3962da6f02ed517208d3'];
    } else if (datos === 2) {
      return audioInputDevices['16054751c3722357e5534bdaa7a96b1c7fb4680aa9039e607cc878c4c3e7b19b'];
    }
  }

  /*    const saveDecibel = async () => {
        console.log("decibel",decibel)
        setInterval(async function () {
          try {
              saveRequest(decibel).then(res => {
                if (res.status === 200) {
                    console.log("Decibel enviado");
                    console.log(res.data) 
                  }
              }    
            )} catch (error) {
              console.log(error.response);
            }
        }, intervaloSend);
  }; */

  useEffect(() => {
    initializeAudio(1);
    initializeAudio(2);
    //saveDecibel();
    
    if (new_flag) {
      ejecutarIntervalo();
      new_flag = false;
    } else{
      ejecutarIntervalo();
    }

    // Limpiar el intervalo al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, []);




  const DEFAULT_OPTIONN = {
    title: {
      text: titulo
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

  /* function actualizarAviso() {
    const avisoElement = document.getElementById('aviso');
    const conteo = contarValoresMayoresA20(v_datos(datos));

    const minutos = Math.floor(conteo / 60);
    const segundos = conteo % 60;
    console.log(v_datos(datos).length, intervaloTiempoAviso, conteo, intervaloTiempoPrecaucion)

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
    } */

    // Ocultar el aviso si el conteo es menor o igual a 60
    /* if (conteo <= intervaloTiempoPrecaucion) {
      avisoElement.style.display = 'none';
    } else {
      avisoElement.style.display = 'block';
    }
  } */




  function ejecutarIntervalo() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(async function () {
      let date = new Date();
      micro_seleccionado = microfono_selec(micro);
      const microfono_nombre = document.getElementById('micro');
      if (micro_seleccionado && micro_seleccionado.label !== undefined && microfono_nombre !== null) {
        microfono_nombre.textContent = micro_seleccionado.label;
      }
      superData.shift(); // Eliminar el dato más antiguo
      now2 = (now2 + 1000);
      superData.push(randomData(1)); // Agregar un nuevo dato
      data = superData.slice(-limite);

      superData2.shift(); // Eliminar el dato más antiguo
      superData2.push(randomData(0)); // Agregar un nuevo dato
      data2 = superData2.slice(-limite);

      decibel = {
        date: formatDate(date),
        db: data[data.length - 1].value[1],
        place: "Galpon 1"
      }



      //await setDoc(doc(db, "cities", "new-city-id"), data);
      const numero = 42; // El número que deseas enviar
      let okp = data[data.length - 1].value[1];
      let okp2 = data2[data2.length - 1].value[1];
      try {
        enviarDecibel("1 "+okp);
        enviarDecibel("2 "+okp2);
      } catch (error) {
        throw error
      }
      




      /*socket.on('connect', () => {
        console.log('Conectado al servidor de Socket.IO');
      });

      socket.on('message', (message) => {
        console.log(`Mensaje recibido del servidor: ${message}`);
      });

      socket.on('disconnect', () => {
        console.log('Desconectado del servidor de Socket.IO');
      });

      // Función para enviar un mensaje al servidor
      function enviarMensaje(mensaje) {
        socket.emit('enviarMensaje', mensaje);
      }

      // Ejemplo de uso
      enviarMensaje('holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');*/




      if (data[data.length - 1].value[1] > 55) {
        let dataf = {
          date: formatDate(date),
          db: data[data.length - 1].value[1],
          place: 'Galpon 1',
          camara: 1
        };
        await setDoc(doc(bd, "decibeles", uuid()), dataf);
      }
      if (data2[data2.length - 1].value[1] > 55) {
        let dataf = {
          date: formatDate(date),
          db: data2[data2.length - 1].value[1],
          place: 'Galpon 2',
          camara: 2
        };
        await setDoc(doc(bd, "decibeles", uuid()), dataf);
      }




      /*try {
        saveRequest(decibel).then(res => {
          if (res.status === 200) {
              console.log("Decibel enviado");
              console.log(res.data) 
            }
        }    
      )} catch (error) {
        console.log(error.response);
      }*/

      //actualizarAviso();
      //console.log(data);
      //updateElapsedTime();

      setOption({
        title: {
          text: titulo
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
              color: ['blue', 'green', 'yellow', 'orange', 'red'], // A list of colors that defines the graph color mapping
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
            data: v_datos(micro)
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
  let micro_seleccionado = microfono_selec(datos);


  return (

    <div>
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
      <div id="micro" className="flex justify-center">{micro_seleccionado ?? "Microfono"}</div>




    </div>
  );
}



