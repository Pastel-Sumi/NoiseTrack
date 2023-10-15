import React, { useEffect, useState } from 'react';
import { Select, Loader, Table, TableCell, Button, Icon, Checkbox } from "semantic-ui-react";
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

    const [selectedReport, setSelectedReport] = useState(reports[0]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [listSelectedReports, setListSelectedReports] = useState({});

    useEffect (() => {
        (async () => {
            try{
                const response = await reportController.getAll();
                setWorkplaces(response)
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

    const handleReportCheckbox = (e, data, id) => {
        let checked = data.checked
        let newList = {
            ...listSelectedReports,
            [id]: checked,
        }
        setListSelectedReports(newList)
    }
    
    //////////////////////////////
    /// Generación de informes ///
    //////////////////////////////

    //Informe global
    const handleReportGlobal = (e) => {
        console.log("informe global")
    }

    //Informe individual por lugar
    const handleReport = async (e, workplace) => {
        console.log(workplace, selectedReport.key, selectedDate)
        await reportController.genReportPlace(workplace, selectedReport.key, selectedDate)
        console.log("informe individual")
    }

    //Informe individual seleccionado
    const handleReportZip = (e) => {
        console.log("informe individual seleccionados")
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
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Lugar</Table.HeaderCell>
                            <Table.HeaderCell>Cantidad de trabajadores</Table.HeaderCell>
                            <Table.HeaderCell>Descargar Informe</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {map(workplaces, (workplace) => (
                            <Table.Row key={workplace.id}>
                                <Table.Cell>{<Checkbox
                                        checked={listSelectedReports[workplace.id]}
                                        onChange={(e, data) => handleReportCheckbox(e, data, workplace.id)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        defaultChecked={false}
                                    />}
                                </Table.Cell>
                                <Table.Cell>{workplace.place}</Table.Cell>
                                <Table.Cell>{workplace.workers}</Table.Cell>
                                <TableCell>{<Button icon onClick={e => handleReport(e, workplace)}>
                                                <Icon className='icon-download' name='download'/>
                                            </Button>}
                                </TableCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Button icon className='all' onClick={e => handleReportGlobal(e)}>
                    Descargar informe general 
                </Button>

                <Button icon className='selected' onClick={e => handleReportZip(e)}>
                    Descargar informes seleccionados
                </Button>
            </div>
        </div>
    )
  return container
}
