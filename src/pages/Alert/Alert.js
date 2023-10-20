import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Button, Icon } from "semantic-ui-react";
import es from "date-fns/locale/es";
import 'react-datepicker/dist/react-datepicker.css';

import { Notification } from "../../components/Alert";
import { Alerts } from "../../api";
import "./Alert.scss";

const alertController = new Alerts();
registerLocale("es", es);

export function Alert() {

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
      (async () => {
          try{
              const response = await alertController.getAll();
              setAlerts(response)
              setLoading(false)
          } catch (error){
              console.log(error)
          }
      })()
  }, [])

  const handleSearchAlert = async () => {
    setLoading(true)
    const response = await alertController.getDate(selectedDate)
    setAlerts(response)
    setLoading(false)
  }

  return (
    <div className='alert-container'>
      <h1 className='alert-container__title'>Alertas</h1>
        <div className='date'>
            <Icon className='icon-calendar' name='calendar alternate outline'/>
            <DatePicker 
                className='datePicker'
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)}
                maxDate={new Date()}
                locale="es"
                dateFormat="dd/MM/yyyy"
            />

            <Button onClick={handleSearchAlert}>Buscar</Button>
        </div>
      <Notification alerts={alerts} loading={loading}/>
    </div>
  )
}
