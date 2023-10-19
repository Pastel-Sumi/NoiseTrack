import ReactEcharts from "echarts-for-react"
import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, orderBy, query, where, setDoc, doc } from "firebase/firestore";
import { bd } from "../../../config";
import { v4 as uuidv4 } from "uuid";

import io from 'socket.io-client';

import { Button, Loader } from "semantic-ui-react";
import { micro } from "../../../pages/Home/Home"

import "./decibels.scss";

//Datos decibeles
let decibels1 = []
let decibels2 = []
let data = [];
let data2 = [];

export function Decibels(props) {
  const [loading, setLoading] = useState(true)

  //Gráfico
  let titulo = "Gráfico de decibeles 5 minutos" //titulo del grafico
  let limite = 300 //máximo de datos por gráfico
  let rango = 5 * 60 * 1000 //tiempo en milisegundos
  const [graph, setGraph] = useState(0);

  const DEFAULT_OPTION = {
    title: {
      text: titulo
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        var date = params.name;
        return date + '   ' + params.value[1] + '[dB]';
      } ,
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
        name: 'Data',
        type: 'line',
        showSymbol: false,
        data: data
      }
    ]
  };
  const [option, setOption] = useState(DEFAULT_OPTION);

  useEffect( () =>  {
    const collectionName = "decibeles";
    const collectionName2 = "decibeles2";

    var currentDate = new Date();
    var numberOfMlSeconds = currentDate.getTime();
    var mlSeconds = 4 * 60 * 60000; //4 horas
    var startOfToday = numberOfMlSeconds - mlSeconds; //4 horas atras del la hora y día actual 
    
    //Microfono 1
    const docRef1 = collection(bd, collectionName);
    const q1 = query(docRef1, where('date','>=',startOfToday),(orderBy("date", "asc")));

    //Microfono 2
    const docRef2 = collection(bd, collectionName2);
    const q2 = query(docRef2, where('date','>=',startOfToday),(orderBy("date", "asc")));

    // Create the DB listener
    getDecibels1(q1)
    getDecibels2(q2)
    setLoading(false)

    return () => {
      decibels1 = [];
      decibels2 = [];
      data = [];
      data2 = [];
    }
  }, []);


  const getDecibels1 = async (query) => {
    const unsuscribe = await onSnapshot(query, (doc) => {      
      if(decibels1.length === 0){
        doc.docChanges().forEach((change) => {
          let date = formatDate(new Date(change.doc.data().date));
          let db = Math.round((change.doc.data().db + Number.EPSILON) * 100) / 100;
          decibels1.push({
            name: date,
            value: [[change.doc.data().date], db]
          })
        })
        data = decibels1.slice(-limite); //Datos del grafico
      }else{
          doc.docChanges().forEach((change) => {
            let date = formatDate(new Date(change.doc.data().date));
            let db = Math.round((change.doc.data().db + Number.EPSILON) * 100) / 100;
            decibels1.push({
              name: date,
              value: [[change.doc.data().date], db]
            }) // Agregar un nuevo dato

            //Envio datos al tracker de microfono 1
            let mic1 = decibels1[decibels1.length - 1].value[1];
            try {
              sendDecibels("1 "+ mic1);
            } catch (error) {
              throw error
            }
          })          
          data = decibels1.slice(-limite); //Datos del grafico
      } 
      changeInterval();
  });
    return () => {
        unsuscribe();
    }
  }

  const getDecibels2 = async (query) => {
    const unsuscribe = await onSnapshot(query, (doc) => {
      if(decibels2.length === 0){
        doc.docChanges().forEach((change) => {
          let date = formatDate(new Date(change.doc.data().date).getTime())
          let db = Math.round((change.doc.data().db + Number.EPSILON) * 100) / 100;
          decibels2.push({
            name: date,
            value: [[change.doc.data().date], db]
          })
        })
        data2 = decibels2.slice(-limite); //Datos del grafico
      }else{
          doc.docChanges().forEach((change) => {
            decibels2.shift(); // Eliminar el dato más antiguo
            let date = formatDate(new Date(change.doc.data().date).getTime())
            let db = Math.round((change.doc.data().db + Number.EPSILON) * 100) / 100;
            decibels2.push({
              name: date,
              value: [[change.doc.data().date], db]
            }) // Agregar un nuevo dato

            //Envio datos al tracker de microfono 1
            let mic1 = decibels2[decibels2.length - 1].value[1];
            try {
              sendDecibels("2 "+ mic1);
            } catch (error) {
              throw error
            }
            data2 = decibels2.slice(-limite); //Datos del grafico
          }) 
      } 
  });
    return () => {
        unsuscribe();
    }
  }

  function padTwoDigits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return (
      [ 
        padTwoDigits(date.getDate()),
        padTwoDigits(date.getMonth() + 1),
        date.getFullYear(),
      ].join("-") +
      " " +
      [
        padTwoDigits(date.getHours()),
        padTwoDigits(date.getMinutes()),
        padTwoDigits(date.getSeconds()),
      ].join(":")
    );
  }

  const changeInterval = () => {
    setOption({
      title: {
        text: titulo
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var date = params.name;
          return date + '   ' + params.value[1] + '[dB]';
        } ,
        axisPointer: {
          animation: true
        }
      },
      xAxis: {
        min: new Date().getTime() - rango,
        max: new Date().getTime(),
        type: 'time',
        splitLine: {
          show: true
        }
      },
      yAxis: {
        min: 0,
        max: 200,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        }
      },
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 200,
          inRange: {
            color: ['blue', 'green', 'yellow', 'orange', 'red'], // A list of colors that defines the graph color mapping
          },
          outOfRange: {
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
          name: 'Data',
          type: 'line',
          showSymbol: false,
          data: v_datos(micro)
        }
      ]
    });
  }

  useEffect( () =>  {  
    changeInterval();
  }, [micro])

  const v_datos = (datos) => {
    if (datos === 1) {
      return data;
    } else if (datos === 2) {
      return data2;
    }
    return data;
  }

  ///////////////////////////////
  //  Comunicación con tracker //
  ///////////////////////////////

  //const socket = io('http://localhost:6001');

  function sendDecibels(decibels){
    console.log("enviando ")
    //socket.emit('message',decibels);
  }

  /////////////////////////////////////////////////////////////
  // Cambio de grafico 5 minutos 30 minutos 1 hora y 4 horas //
  /////////////////////////////////////////////////////////////

  const toggleRangoButton_5M = () => {
    if(graph !== 5){
      titulo = 'Gráfico de decibeles 5 minutos';
      limite = 300;
      rango = 5 * 60 * 1000;
      setGraph(5);
      changeInterval();
    }
  };

  const toggleRangoButton_30M = () => {
    if(graph !== 30){
      titulo = 'Gráfico de decibeles 30 minutos';
      limite = 1800;
      rango = 30 * 60 * 1000;
      setGraph(30);
      changeInterval();
    }
  };

  const toggleRangoButton_1H = () => {
    if(graph !== 1){
      titulo = 'Gráfico de decibeles 1 hora';
      limite = 3600;
      rango =2* 30 * 60 * 1000;
      setGraph(1);
      changeInterval();
    }
  };

  const toggleRangoButton_4H = () => {
    if(graph !== 4){
      titulo = 'Gráfico de decibeles 4 horas';
      limite = 14400;
      rango = 4 * 2* 30 * 60 * 1000;
      setGraph(4);
      changeInterval();
    }
  };

  //Crea datos de prueba
  /* const create = async () => {
    try {
      const idCamera = uuidv4(); //crea id de la decibel
      const date = new Date().getTime();
      const place = "Sala 1";
      var min = 55.1;
      var max = 193.36;
      var random = Math.random()*(max - min)+min
      const db = random
      const data = { id: idCamera, date, place, db};
      const docRef = doc(bd, 'decibeles', idCamera);
      await setDoc(docRef, data);
      } catch (error) {
          throw error;
      }
  } */

  let container = loading ? (
    <Loader active inline="centered" size="large">
        Cargando
    </Loader> 
  ) : (
    <div className="decibels-container">
        <div> 
            <ReactEcharts
              option={option}
              style={{ width: "650px", height: "350px" }}
            />

            <div className="decibels-container__graph">
              <Button onClick={toggleRangoButton_5M}> 5 Minutos</Button>
              <Button onClick={toggleRangoButton_30M}> 30 Minutos</Button>
              <Button onClick={toggleRangoButton_1H}> 1 Hora</Button>
              <Button onClick={toggleRangoButton_4H}> 4 Horas</Button>
            </div>
        </div>

      {/*<Button onClick={create}> Nuevo decibel</Button>*/}

    </div>
  )
  return container;
}



