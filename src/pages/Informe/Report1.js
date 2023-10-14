import React, {useEffect, useState} from 'react'

import {
  collection,
  getDocs,
  getFirestore,
  where,
  query,
} from 'firebase/firestore'
import { initFirebase } from '../../config/firebase';
import { Line } from 'react-chartjs-2'; 
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';

import "./Report.scss"
import { Button } from 'semantic-ui-react';

//const date = new Date();

const db = getFirestore(initFirebase)

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}/${month}/${date}`;
}

export function Report() {
  const [currentDate, setCurrentDate] = useState(String(new Date()));
  const [alertData, setAlertData] = useState([]);
  //const fechaDeseada = new Date();
  const [decibelsData, setDecibelsData] = useState([]);
  var fecha_ini = new Date();
  var fecha_end = new Date();
  fecha_ini.setUTCHours(0,0,0,0)
  fecha_end.setUTCHours(23,59,59,999);


  const facturaData = {
    numero: "123456",
    producto: "Pizza",
    cantidad: 5,
    precio: 2000,
    fecha: "2023-09-11",
    cliente: "Sofia",
    total: 10000,
  }

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.text("Factura", 95,20);
    doc.text(`Numero de factura: ${facturaData.numero}`, 10,20);
    doc.text(`Numero de factura: ${facturaData.fecha}`, 10,30);
    doc.text(`Numero de factura: ${facturaData.cliente}`, 10,40);
    doc.text(`Numero de factura: ${facturaData.total}`, 10,50);
    

    //Guardar pdf con nombre especifico
    doc.save(`factura_${facturaData.numero}.pdf`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'alerts'), // Reemplaza con el nombre de tu colección
          where('created', '>=', fecha_ini), // Reemplaza 'fecha' con el nombre de tu campo datetime
          where('created', '<=', fecha_end)
        );

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlertData(documents);
      } 
      catch (error) {
        console.error('Error fetching alerts data:', error);
      }

      try {
        const w = query(
          collection(db, 'decibeles'), // Reemplaza con el nombre de tu colección
          where('date', '>', "2023-09-28 00:00:00"), // Reemplaza 'fecha' con el nombre de tu campo datetime
          where('date', '<', "2023-09-28 23:59:59")
        );

        const querySnapshot = await getDocs(w);
        const decibeles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDecibelsData(decibeles);
      } 
      catch (error) {
        console.error('Error fetching alerts data:', error);
      }


    };

    fetchData();
  });
  //[fechaDeseada]);

  const chartData = {
    labels: decibelsData.map((data) => data.date),
    datasets: [
      {
        label: 'Decibeles',
        data: decibelsData.map((data) => data.db),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  return (
    <div className='Reporte'>
      <Button onClick={generarPDF}>
        Generar pdf
      </Button>
      <div>
        <h1>{currentDate}</h1>
      </div>
      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>fecha</th>
              <th>db</th>
              <th>lugar</th>
              <th>duracion</th>
              <th>trabajadores</th>
            {/* Agrega más encabezados de columna según tus datos */}
            </tr>
          </thead>
          <tbody>
            {alertData.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.db}</td>
                <td>{item.place}</td>
                <td>{item.time}</td>
                <td>{item.workers}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Line data={chartData} />
       </div>
    </div>
    
    );
}