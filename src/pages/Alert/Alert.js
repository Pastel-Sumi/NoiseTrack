import React, { useState, useEffect } from 'react';

import { Notification } from "../../components/Alert";
import { Alerts } from "../../api";
import "./Alert.scss";

const alertController = new Alerts();

export function Alert() {

  const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        (async () => {
            try{
                const response = await alertController.getAll();
                setAlerts(response)
            } catch (error){
                console.log(error)
            }
        })()
    }, [])

  return (
    <div className='alert-container'>
      <h1 className='alert-container__title'>Alertas del día</h1>
      <Notification alerts={alerts}/>
    </div>
  )
}
