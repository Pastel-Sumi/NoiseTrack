import React, { useEffect, useState } from 'react';
import { Select, Loader, Table, TableCell, Button, Icon } from "semantic-ui-react";
import DatePicker, { registerLocale } from 'react-datepicker';
import es from "date-fns/locale/es";
import { map } from "lodash";

import { Reports } from "../../../api";
import 'react-datepicker/dist/react-datepicker.css';
import "./InfoReport.scss";

const reportController = new Reports();
registerLocale("es", es);

export function InfoReport() {
    const [reports, setReports] = useState([
        { key: '1', text: 'Informe diario', value: 'diario'},
        { key: '2', text: 'Informe semanal', value: 'semanal'},
        { key: '3', text: 'Informe mensual', value: 'mensual'},
    ])
    const [workplaces, setWorkplaces] = useState([]);

    const [decibeles, setDecibeles] = useState([]);
    const [decibeles2, setDecibeles2] = useState([]);
    const [alertas, setAlertas] = useState([]);

    const [selectedReport, setSelectedReport] = useState(reports[0]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect (() => {
        (async () => {
            try{
                const response = await reportController.getAll();
                setWorkplaces(response)
                const response2 = await reportController.getDecibeles();
                setDecibeles(response2)
                
                const response3 = await reportController.getAlerts();
                setAlertas(response3)
                
                const response4 = await reportController.getDecibeles2();
                setDecibeles2(response4)
                setLoading(false)
            } catch (error){
                console.log(error)
            }
        })()
    }, [])

    ///////////////////////////////
    /// Administración informes ///
    ///////////////////////////////

    const handleReportChange = (event, { value }) => {
        let selected = {}
        if(value === 'diario'){
            selected = reports[0];
        }else if(value === 'semanal'){
            selected = reports[1];
        }else{
            selected = reports[2];
        }
        setSelectedReport(selected);
    };
    
    //////////////////////////////
    /// Generación de informes ///
    //////////////////////////////

    //Informe global
    const handleReportGlobal =  async (e, workplaces, decibeles, alertas, decibeles2) => {
        console.log("informe global")
        await reportController.genReportGeneral( decibeles2, alertas, decibeles, workplaces, selectedReport.key, selectedDate)
    }

    //Informe individual por lugar
    const handleReport = async (e, workplace, decibeles, alertas, decibeles2) => {
        console.log(workplace, selectedReport.key, selectedDate)
        await reportController.genReportPlace( decibeles2, alertas, decibeles, workplace, selectedReport.key, selectedDate)
        console.log("informe individual")
    }

    let container = loading ? (
        <Loader active inline="centered" size="large">
            Cargando
        </Loader> 
    ) : (
        <div className='infoReport-container'>
            <div className='infoReport-container__selector'>
                <div className='selector'>
                    <div className='report'>
                        <p className='label-selector'>Tipo de informe:</p>
                        <Select
                            id="report-select"
                            options={reports}
                            value={selectedReport.value}
                            onChange={handleReportChange}
                        />
                    </div>

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
                    </div>
                </div>
            </div>
            <div className='infoReport-container__body'>
                <h2>Áreas de trabajo</h2> 

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Lugar</Table.HeaderCell>
                            <Table.HeaderCell>Cantidad de trabajadores</Table.HeaderCell>
                            <Table.HeaderCell>Descargar Informe</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {map(workplaces, (workplace) => (
                            <Table.Row key={workplace.id}>
                                <Table.Cell>{workplace.place}</Table.Cell>
                                <Table.Cell>{workplace.workers}</Table.Cell>
                                <TableCell>{<Button icon onClick={e => handleReport(e, workplace, decibeles, alertas, decibeles2)}>
                                                <Icon className='icon-download' name='download'/>
                                            </Button>}
                                </TableCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Button icon className='all' onClick={e => handleReportGlobal(e, workplaces, decibeles, alertas, decibeles2)}>
                    Descargar informe general 
                </Button>

            </div>
        </div>
    )
  return container
}
