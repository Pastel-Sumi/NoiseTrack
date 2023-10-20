import React from 'react'
import { Icon, Image, Loader, Grid } from "semantic-ui-react";
import "./Notification.scss"
import { map, size } from "lodash";

export function Notification(props) {

    const { alerts, loading } = props;

    if(loading){
        return (
            <Loader active inline="centered" size="large">
                Cargando
            </Loader>
        )
    }
    
    return (
        <div className='alerts'>
            {
                size(alerts) === 0 ? (
                    <h3 className='info-alerts'>No se han registrado alertas</h3>
                ) : (
                    <Grid>
                        <Grid.Row columns={1}>
                            {map(alerts, (alert) => (
                                <Grid.Column key={alert.id} className={`alert ${alert.type === 1 ? "danger1": "danger2"}`}>
                                <h1 className='alert__container-title'>{alert.type === 1 ? "Moderado:": "Urgente:"}</h1>
                                <h2 className='alert__container-title-sub'> {alert.type === 1 ? "Se sobrepasaron los niveles de ruido por más de 1/8 del tiempo permitido": "Exposición peligrosa a niveles de ruido por más del tiempo permitido"}</h2>
                                <div className='alert__container'>
                                    <div className='alert__container-body'>
                                    
                                        <Icon className='icon-alert' name={`exclamation ${alert.type === 1 ? "circle": "triangle"}`}/>
                        
                                        <div>
                                            <div className='alert__container-body-info'>
                                                <div className='alert-info'>
                                                    <Icon className='icon' name='warehouse'/>
                                                    <p className='info'>Lugar de incidente: {alert.place}</p>
                                                </div>
                        
                                                <div className='alert-info'>
                                                    <Icon className='icon' name='calendar alternate'/>
                                                    <p className='info'>Día: {alert.date.split(",")[0]} {alert.date.split(",")[1]}</p>
                                                </div>
                        
                                                <div className='alert-info'>
                                                    <Icon className='icon' name='volume up'/>
                                                    <p className='info'>Decibel promedio: {alert.db} [dB]</p>   
                                                </div>
                        
                                                <div className='alert-info'>
                                                    <Icon className='icon' name='user'/>
                                                    <p className='info'>Trabajadores expuestos: {alert.workers} </p>
                                                </div>
                        
                                                <div className='alert-info'>
                                                    <Icon className='icon' name='clock'/>
                                                    <p className='info'>Tiempo transcurrido: {alert.time} [seg]</p>
                                                </div>
                                            
                                            </div>
                                    
                                        </div>
                                    </div> 
                                    <Image src={`data:image/jpeg;base64,${alert.image}`} />
                                </div>
                            </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid> 
                )
            }
        </div>
    )
}



