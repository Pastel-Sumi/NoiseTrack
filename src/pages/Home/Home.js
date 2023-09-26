import React from 'react'
import { Button } from "semantic-ui-react";

import { Measurement } from "../../api";

import { Chart } from "../../components/Monitoreo/monitoreo";

import  { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const measurement = new Measurement();

export function Home() {


  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleToggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateClick = (value) => {
    setSelectedDate(value);
    console.log('Día seleccionado:', value);
    setShowCalendar(false); // Cierra el calendario después de seleccionar una fecha
  };

  const handleMeasurement = async () => {
    try{
      await measurement.getDecibels();
    }catch(error){
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Home Screen</h1>
      <Button primary onClick={handleMeasurement}>Decibeles</Button>
      <div style={{ width: '100', display: 'flex', justifyContent: 'center' }}>
  <Chart />
</div>

<div>
      <h1>Calendario</h1>
      <button onClick={handleToggleCalendar}>
        {showCalendar ? 'Cerrar Calendario' : 'Abrir Calendario'}
      </button>
      {showCalendar && (
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
        />
      )}
    </div>
    </div>
  )
}
