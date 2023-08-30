import { saveRequest } from "../../api/decibel";
import { useEffect, useState } from "react";

//hola
function Audio() {
    //Obtención de audio
    let isAudioInitialized = false;
    let audioStream;
    let rms =0;
    let rmss;
    let offset = 0;
    let value;
    let micV =0 ; // Variable global para almacenar el valor del micrófono
    let localDbValues = []; // array to store db values for each loop withing the refresh_rate
    
    //Envio de datos BD
    let intervaloSend = 1000
    let decibel;

    useEffect(() => {
        initializeAudio();
        getInformation();
        saveDecibel();
    }, []);

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

    const saveDecibel = async () => {
          setInterval(async function () {
            try {
                await saveRequest(decibel).then(res => {
                  if (res.status === 200) {
                      console.log(res.data)
                      console.log("Decibel enviado");
                    }
                }    
              )} catch (error) {
                console.log(error.response.data);
              }
          }, intervaloSend);
    };

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
            rms = Math.sqrt(rms / (datas.length));
            rmss = rms;
            offset = 0;
            value = rms + offset;
          
            //Convierte RMS a decibeles
            let db = 20 * Math.log10(Math.abs(rms)) * 2
            
            localDbValues.push(value);
            // Actualizar la variable global micV con el valor del micrófono
            micV = db;
          };
    }

    var now2 = new Date().getTime();
    let intervalo = 1000; 
    let super_data = [];
    let limite =300;
    let data = [];
    let intervalId;

    // Reemplaza el valor aleatorio con el valor del micrófono
    function replaceData() {
        now2 = now2 + intervalo;
        var micValue = obtenerValorDelMicrofono();
        return {
            name: now2,
            value: micValue
        };
    }

    // Función para obtener el valor del micrófono
    function obtenerValorDelMicrofono() {
        return micV; // Devolver el valor del micrófono almacenado en la variable global
    }

    //Función obtiene y registra información cada un segundo  
    const getInformation = async () => {
        intervalId = setInterval(function () {
            let date =  new Date();
            super_data.shift(); // Eliminar el dato más antiguo
            super_data.push(replaceData()); // Agregar un nuevo dato
            data = super_data.slice(-limite);
            
            let sendData = {
                date:formatDate(date),
                db: data[0].value,
                place: "Galpon 1"
            }
            decibel = sendData
          }, intervalo);
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
        <section className="flex justify-center items-center">
          <h1 className="text-5xl py-2 font-bold">Gráfico con Datos de Micrófono</h1>
        </section>
    </div>
    );
  }
  
  export default Audio;