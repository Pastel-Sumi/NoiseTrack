import { collection, getDocs } from "firebase/firestore";
import { map } from "lodash";
import { bd } from "../config";
import { jsPDF } from 'jspdf';
import * as echarts from 'echarts';
import { createCanvas } from 'canvas';
import logo64 from "../assets/png/logo.png";

function getDaysOfWeekForMonth(year, month) {
    const daysOfWeek = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const result = [];
    const firstDayOfMonth = new Date(year, month, 1);
    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const formattedDate = day.toString().padStart(2, '0'); 

        result.push(`${dayOfWeek} ${formattedDate}`);
    }
    return result;
}



function contarDecibelesPorTiempo(date, decibeles, decibeles2, tipo, workplace) {

    let formatDate = '';
    let elementosFiltrados = '';
    let mes = 0;
    let year = 0;
    let diasMes = '';
    const promedios = [];
    const diassemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

    formatDate = date.toLocaleDateString("es-ES", { month: 'long' }) + date.toLocaleDateString("es-ES", { year: 'numeric' });

    let arrayDecibeles = '';

    if (workplace.place === 'Sala 1') {
        arrayDecibeles = decibeles
    } else if (workplace.place === 'Sala 2') {
        arrayDecibeles = decibeles2
    }
    if (tipo === "diario") {
        formatDate = date.toLocaleDateString("es-ES");
        elementosFiltrados = arrayDecibeles.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento.toLocaleDateString("es-ES");
            if (fechaaux === formatDate) {
                return true;
            } else {
                return false;
            }
        });
        const promediosPorHora = {};
        for (let i = 7; i <= 19; i++) {
            promediosPorHora[i] = []
        }

        elementosFiltrados.forEach(elemento => {
            const hora = new Date(elemento.date).getHours();

            if (promediosPorHora[hora]) {
                promediosPorHora[hora].push(elemento.db);
            }
        });



        for (let hora = 7; hora <= 19; hora++) {
            const valoresPorHora = promediosPorHora[hora] || [];

            if (valoresPorHora.length > 0) {
                const promedio = valoresPorHora.reduce((a, b) => a + b, 0) / valoresPorHora.length;
                promedios.push({ hora, promedio });
            } else if (valoresPorHora.length === 0) {
                const promedio = 0;
                promedios.push({ hora, promedio });
            }
        }
    } else if (tipo === "semanal") {
        let auxDate = new Date();
        auxDate.setDate(date.getDate() - 7);
        elementosFiltrados = arrayDecibeles.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento;
            if (fechaaux >= auxDate && fechaaux <= date) {
                return true;
            } else {
                return false;
            }
        });
        const promediosPorDia = {};
        for (let i = 0; i <= 6; i++) {
            promediosPorDia[diassemana[i]] = []
        }
        elementosFiltrados.forEach(elemento => {
            const dia = new Date(elemento.date).getUTCDay();
            if (promediosPorDia[diassemana[dia]]) {

                promediosPorDia[diassemana[dia]].push(elemento.db);
            }
        });


        for (let semana = 0; semana <= 6; semana++) {
            const valoresPorSemana = promediosPorDia[diassemana[semana]] || [];

            if (valoresPorSemana.length > 0) {
                const promedio = valoresPorSemana.reduce((a, b) => a + b, 0) / valoresPorSemana.length;
                const aux = diassemana[semana];
                promedios.push({ aux, promedio });
            } else if (valoresPorSemana.length === 0) {
                const promedio = 0;
                const aux = diassemana[semana];
                promedios.push({ aux, promedio });
            }
        }
    } else {
        formatDate = date.toLocaleDateString("es-ES", { month: 'long' }) + date.toLocaleDateString("es-ES", { year: 'numeric' });
        mes = date.toLocaleDateString("es-ES", { month: 'numeric' }) - 1;
        year = date.toLocaleDateString("es-ES", { year: 'numeric' });
        diasMes = getDaysOfWeekForMonth(year, mes);
        elementosFiltrados = arrayDecibeles.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento.toLocaleDateString("es-ES", { month: 'long' }) + fechaElemento.toLocaleDateString("es-ES", { year: 'numeric' });
            if (fechaaux === formatDate) {
                return true;
            } else {
                return false;
            }
        });
        const promediosPorSemana = {};
        for (let i = 0; i <= diasMes.length; i++) {
            promediosPorSemana[i] = []
        }
        elementosFiltrados.forEach(elemento => {
            const semana = (new Date(elemento.date)).getDate();
            if (promediosPorSemana[semana]) {

                promediosPorSemana[semana].push(elemento.db);
            }
        });


        for (let semana = 0; semana <= diasMes.length; semana++) {
            const valoresPorSemana = promediosPorSemana[semana] || [];

            if (valoresPorSemana.length > 0) {
                const promedio = valoresPorSemana.reduce((a, b) => a + b, 0) / valoresPorSemana.length;
                const aux = semana;
                promedios.push({ aux, promedio });
            } else if (valoresPorSemana.length === 0) {
                const promedio = 0;
                const aux = semana;
                promedios.push({ aux, promedio });
            }
        }
    }
    console.log("Los decibles encontrados son: " + elementosFiltrados.map(elemento => elemento.db))


    const valoresPromedio = promedios.map(promedio => promedio.promedio)
    return [valoresPromedio, diasMes];
}



function contarAlertasPorTipo(date, alertas, tipo, workplace) {


    // Crear un lienzo (canvas)
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');
    let mes = 0;
    let year = 0;
    let diasMes = '';
    let lugar = '';
    let elementosFiltrados = '';

    const myChart = echarts.init(canvas, null, { renderer: 'canvas' });
    let flag = false;

    let formatDate = '';


    if (tipo === "diario") {
        //type = "diario"
        formatDate = date.toLocaleDateString("es-ES");
        elementosFiltrados = alertas.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento.toLocaleDateString("es-ES");
            if (fechaaux === formatDate && elemento.place === workplace.place) {
                return true;
            } else {
                return false;
            }
        });
    } else if (tipo === "semanal") {
        //type = "semanal"
        let auxDate = new Date();
        auxDate.setDate(date.getDate() - 7);
        elementosFiltrados = alertas.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento;
            if (fechaaux >= auxDate && fechaaux <= date && elemento.place === workplace.place) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        //type = "mensual"
        formatDate = date.toLocaleDateString("es-ES", { month: 'long' }) + date.toLocaleDateString("es-ES", { year: 'numeric' });
        mes = date.toLocaleDateString("es-ES", { month: 'numeric' }) - 1;
        year = date.toLocaleDateString("es-ES", { year: 'numeric' });
        diasMes = getDaysOfWeekForMonth(year, mes);
        elementosFiltrados = alertas.filter(elemento => {
            const fechaElemento = new Date(elemento.date);
            const fechaaux = fechaElemento.toLocaleDateString("es-ES", { month: 'long' }) + fechaElemento.toLocaleDateString("es-ES", { year: 'numeric' });
            if (fechaaux === formatDate && elemento.place === workplace.place) {
                return true;
            } else {
                return false;
            }
        });
    }

    const cuentas = [];
    const rangos = [{ min: 55, max: 60 }, { min: 60, max: 65 }, { min: 65, max: 70 }, { min: 70, max: 75 },
    { min: 75, max: 80 }, { min: 80, max: 85 }, { min: 85, max: 90 }, { min: 90, max: 95 }, { min: 95, max: 100 },
    { min: 100, max: 105 }, { min: 105, max: 110 }, { min: 110, max: 115 }, { min: 115, max: 120 },
    { min: 120, max: 125 }, { min: 125, max: 130 }, { min: 130, max: 135 }, { min: 135, max: 140 },
    { min: 140, max: 145 }, { min: 145, max: 150 }, { min: 150, max: 155 }, { min: 155, max: 160 }];

    for (const rango of rangos) {
        const cuenta = elementosFiltrados.filter(elemento => elemento.db >= rango.min && elemento.db < rango.max).length;
        //console.log(cuenta)
        cuentas.push(cuenta);
    }



    const sumaWorkers = elementosFiltrados
        .reduce((acumulador, elemento) => {
            acumulador.workers += elemento.workers;
            acumulador.workers_epp += elemento.workers_epp;
            acumulador.workers_no_epp += elemento.workers_no_epp;
            return acumulador;
        }, { workers: 0, workers_epp: 0, workers_no_epp: 0 });
    const conteoTipos = elementosFiltrados.reduce((acumulador, elemento) => {
        if (elemento.type === 1 && elemento.db >= 55) {
            acumulador.tipo1++;
        } else if (elemento.type === 2 && elemento.db >= 55) {
            acumulador.tipo2++;
        }
        return acumulador;
    }, { tipo1: 0, tipo2: 0 });
    console.log("Las cuenstas son: " + cuentas)
    return [cuentas, sumaWorkers.workers, sumaWorkers.workers_no_epp, conteoTipos.tipo1 + conteoTipos.tipo2, conteoTipos.tipo1, conteoTipos.tipo2];
}





export class Reports {


    collectionName = "workplace";
    collectionName2 = "workers";
    collectionName3 = "decibeles";
    collectionName4 = "alerts";
    collectionName5 = "decibeles2";

    async getDecibeles() {

        try {
            const decibelesGuardados = collection(bd, this.collectionName3);
            const snapshopDecibeles = await getDocs(decibelesGuardados);
            let decibeles = map(snapshopDecibeles.docs, (decibeles) => {
                return {

                    ...decibeles.data(),
                }
            });
            return decibeles;
        } catch (error) {
            throw error
        }
    }

    async getDecibeles2() {

        try {
            const decibeles2Guardados = collection(bd, this.collectionName5);
            const snapshopDecibeles2 = await getDocs(decibeles2Guardados);
            let decibeles2 = map(snapshopDecibeles2.docs, (decibeles2) => {
                return {

                    ...decibeles2.data(),
                }
            });
            return decibeles2;
        } catch (error) {
            throw error
        }
    }

    async getAlerts() {

        try {
            const alertasGuardados = collection(bd, this.collectionName4);
            const snapshopAlertas = await getDocs(alertasGuardados);
            let alertas = map(snapshopAlertas.docs, (alertas) => {
                return {

                    ...alertas.data(),
                }
            });
            return alertas;
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            const docRefWorkplace = collection(bd, this.collectionName);
            const docRefWorkers = collection(bd, this.collectionName2);
            const snapshopWorkplace = await getDocs(docRefWorkplace)
            const snapshopWorkers = await getDocs(docRefWorkers)

            let workplace = map(snapshopWorkplace.docs, (workplace) => {
                let cont = 0;
                snapshopWorkers.docs.forEach((worker, index) => {
                    if (workplace.data().place === worker.data().place) {
                        cont += 1;
                    }
                });
                return {
                    ...workplace.data(),
                    workers: cont,
                }
            })
            return workplace;
        } catch (error) {
            throw error
        }
    }

    async genReportPlace(decibeles2, alertas, decibeles, workplace, typeReport, date) {


        const fechaActual = new Date(); // Fecha actual

        const mesFechaActual = fechaActual.getMonth();
        const añoFechaActual = fechaActual.getFullYear();
        const mesOtraFecha = date.getMonth();
        const añoOtraFecha = date.getFullYear();
        const general = 'NO';

        let ejeX = [];


        try {


            let type = ""
            let formatDate = ""
            //getAll()
            let promedios = '';

            if (typeReport === "1") {
                type = "diario"
                formatDate = date.toLocaleDateString("es-ES");
                ejeX = ['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
                    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
                promedios = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplace);
            } else if (typeReport === "2") {
                type = "semanal"
                let auxDate = new Date();
                auxDate.setDate(date.getDate() - 7);
                formatDate = auxDate.toLocaleDateString("es-ES") + "-" + date.toLocaleDateString("es-ES");
                ejeX = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
                promedios = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplace);
            } else {
                type = "mensual"
                formatDate = date.toLocaleDateString("es-ES", { month: 'long' }) + date.toLocaleDateString("es-ES", { year: 'numeric' });
                promedios = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplace);
                if (mesFechaActual === mesOtraFecha && añoFechaActual === añoOtraFecha) {
                    const diaDelMes = fechaActual.getDate();
                    ejeX = promedios[1].slice(0, diaDelMes);
                } else {
                    ejeX = promedios[1];
                }
            }


            // Crear un lienzo (canvas)
            const canvas = createCanvas(800, 400);
            const canvas2 = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            // Crear una instancia de ECharts
            const myChart = echarts.init(canvas, null, { renderer: 'canvas' });
            const myChart2 = echarts.init(canvas2, null, { renderer: 'canvas' });

            const option = {
                title: {
                    text: '',
                },
                xAxis: {
                    data: ejeX,
                    axisLabel: {
                        rotate: 45, // Gira las etiquetas en un ángulo de 45 grados
                        fontSize: 12, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                yAxis: {
                    axisLabel: {
                        fontSize: 12, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                visualMap: [
                    {
                        show: false,
                        type: 'continuous',
                        seriesIndex: 0,
                        min: 0,
                        max: 150,
                        inRange: {
                            color: ['blue', 'green', 'yellow', 'orange', 'red'],
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
                backgroundColor: '#FFF',
                series: [
                    {
                        type: 'line',

                        data: promedios[0],
                        animation: false,
                    },
                ],
            };

            // Configurar las opciones en el gráfico
            myChart.setOption(option);

            // Guardar una imagen del gráfico
            const dataURL = canvas.toDataURL('image/png');


            const alertasGuardadas = contarAlertasPorTipo(date, alertas, type, workplace, general);

            const option2 = {
                title: {
                    text: '',
                },
                xAxis: {
                    data: ['55-60', '60-65', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100', '100-105', '105-110', '110-115', '115-120', '120-125', '125-130', '130-135', '135-140', '140-145', '145-150', '150-155', '155-160'],
                    axisLabel: {
                        rotate: 45, // Gira las etiquetas en un ángulo de 45 grados
                        fontSize: 12, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                yAxis: {
                    axisLabel: {
                        fontSize: 12, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                backgroundColor: '#FFF', // Fondo blanco
                series: [
                    {
                        type: 'bar',
                        data: alertasGuardadas[0],
                        animation: false,
                        color: '#00b4d8',
                    },
                ],
            };
            myChart2.setOption(option2);

            const dataURL2 = canvas2.toDataURL('image/png');


            console.log('Imagen del gráfico guardada como "grafico.png"');
            let porcentaje = 0;

            if (alertasGuardadas[1] != 0) {


                porcentaje = Math.floor((alertasGuardadas[2] / alertasGuardadas[1]) * 100);
            } else {
                porcentaje = 40;
            }
            let data = {
                name: "nombre empresa",
                epa: 100 - porcentaje,
                no_epa: porcentaje,
                total_alert: 50,
                alert_m: 36,
                alert_u: 14

            }
            const doc = new jsPDF("p", "mm", "a4");

            //-------------Imagenes------------------------------
            doc.addImage(logo64, 'JPEG', 13, 10, 25, 25);

            //------------Figuras-------------------------------
            doc.rect(10, 40, 190, 0.001)
            doc.rect(10, 58, 190, 0.001)

            doc.setFillColor(221, 196, 33);
            doc.roundedRect(40, 65, 55, 40, 4, 4, 'F')
            doc.setFillColor(222, 113, 118);
            doc.roundedRect(115.5, 65, 55, 40, 4, 4, 'F')

            //Fondo Gráfico

            doc.setFillColor(0, 119, 182);
            doc.roundedRect(11, 121, 189, 72, 4, 4, 'F')

            //doc.setFillColor(255, 165, 0);
            doc.setFillColor(0, 119, 182);
            doc.roundedRect(11, 201, 189, 72, 4, 4, 'F')

            /*doc.rect(10, 112, 190, 0.001)
            doc.rect(10, 192, 190, 0.001)*/

            //-------------Texto---------------------------------
            doc.setFont("Helvetica").setFontSize(20).text(`Informe ${type} por área de trabajo`, 195, 25, { align: 'right' });
            doc.setFont("Helvetica").setFontSize(15).text(`${data.name}`, 195, 33, { align: 'right' });
            doc.setFont("Helvetica").setFontSize(13).text(`Área de trabajo: ${workplace.place}`, 13, 47, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).text(`Total de trabajadores: ${workplace.workers}`, 13, 53, { align: 'left' });

            if (type === "semanal") {
                let auxDate = new Date();
                auxDate.setDate(date.getDate() - 7);
                let startDate = auxDate.toLocaleDateString("es-ES")
                let endDate = date.toLocaleDateString("es-ES")

                doc.setFont("Helvetica").setFontSize(13).text(`Inicio: ${startDate}`, 197, 47, { align: 'right' })
                doc.setFont("Helvetica").setFontSize(13).text(`Fin: ${endDate}`, 197, 53, { align: 'right' })

            } else if (type === "diario") {
                doc.setFont("Helvetica").setFontSize(13).text(`Día: ${formatDate}`, 197, 47, { align: 'right' })

            } else {
                let mounth = date.toLocaleDateString("es-ES", { month: 'long' })
                let year = date.toLocaleDateString("es-ES", { year: 'numeric' })
                doc.setFont("Helvetica").setFontSize(13).text(`Mes: ${mounth} ${year}`, 197, 47, { align: 'right' })
            }

            doc.setFont("Helvetica").setFontSize(35).setTextColor(255, 255, 255).text(`${data.epa}%`, 69.5, 82, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`Uso de equipo`, 67.5, 93, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`de protección auditivo`, 67.5, 98, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(35).setTextColor(255, 255, 255).text(`${data.no_epa}%`, 144.5, 82, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`No uso de equipo`, 142.5, 93, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`de protección auditivo`, 142.5, 98, { align: 'center' });

            doc.setFont("Helvetica").setFontSize(15).setTextColor(0, 0, 0).text("Decibeles generados durante el peridodo", 13, 120, { align: 'left' });
            doc.addImage(dataURL, 'JPEG', 13, 122, 185, 69);

            doc.setFont("Helvetica").setFontSize(15).setTextColor(0, 0, 0).text("Distribución de alertas producidas", 13, 200, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Total de alertas en el perido: ${alertasGuardadas[3]}`, 13, 280, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Alertas moderadas: ${alertasGuardadas[4]}`, 13, 285, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Alertas urgentes: ${alertasGuardadas[5]}`, 13, 290, { align: 'left' });
            doc.addImage(dataURL2, 'JPEG', 13, 202, 185, 69);



            //Guardar pdf con nombre especifico

            doc.save(`Informe_${type}_${formatDate}_${workplace.place}.pdf`)

        } catch (error) {
            throw error;
        }

    }



    async genReportGeneral(decibeles2, alertas, decibeles, workplaces, typeReport, date) {



        const fechaActual = new Date(); // Fecha actual

        const mesFechaActual = fechaActual.getMonth();
        const añoFechaActual = fechaActual.getFullYear();
        const mesOtraFecha = date.getMonth();
        const añoOtraFecha = date.getFullYear();
        const general = 'NO';

        let ejeX = [];


        try {


            let type = ""
            let formatDate = ""
            //getAll()
            let promedios1 = '';
            let promedios2 = '';

            if (typeReport === "1") {
                type = "diario"
                formatDate = date.toLocaleDateString("es-ES");
                ejeX = ['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
                    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
                promedios1 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[0]);
                promedios2 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[1]);
            } else if (typeReport === "2") {
                type = "semanal"
                let auxDate = new Date();
                auxDate.setDate(date.getDate() - 7);
                formatDate = auxDate.toLocaleDateString("es-ES") + "-" + date.toLocaleDateString("es-ES");
                ejeX = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
                promedios1 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[0]);
                promedios2 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[1]);
            } else {
                type = "mensual"
                formatDate = date.toLocaleDateString("es-ES", { month: 'long' }) + date.toLocaleDateString("es-ES", { year: 'numeric' });
                promedios1 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[0]);
                promedios2 = contarDecibelesPorTiempo(date, decibeles, decibeles2, type, workplaces[1]);
                if (mesFechaActual === mesOtraFecha && añoFechaActual === añoOtraFecha) {
                    const diaDelMes = fechaActual.getDate();
                    ejeX = promedios1[1].slice(0, diaDelMes);
                } else {
                    ejeX = promedios1[1];
                }
            }


            // Crear un lienzo (canvas)
            const canvas = createCanvas(800, 400);
            const canvas2 = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            // Crear una instancia de ECharts
            const myChart = echarts.init(canvas, null, { renderer: 'canvas' });
            const myChart2 = echarts.init(canvas2, null, { renderer: 'canvas' });


            const option = {
                title: {
                    text: '',
                },
                xAxis: {
                    data: ejeX,
                    axisLabel: {
                        rotate: 45,
                        fontSize: 12,
                        textStyle: {
                            color: '#000',
                        },
                    },
                },
                yAxis: {
                    axisLabel: {
                        fontSize: 12,
                        textStyle: {
                            color: '#000',
                        },
                    },
                },
                backgroundColor: '#FFF',//'#888',
                series: [
                    {
                        name: workplaces[0].place, // Nombre de la primera línea
                        type: 'line',
                        data: promedios1[0],
                        animation: false,
                        color: '#00b4d8',
                    },
                    {
                        name: workplaces[1].place, // Nombre de la segunda línea
                        type: 'line',
                        data: promedios2[0],
                        animation: false,
                        color: '#2a9d8f',
                    },
                ],
                legend: {
                    data: [workplaces[0].place, workplaces[1].place],
                    textStyle: {
                        color: '#000',
                    },
                },
            };

            // Configurar las opciones en el gráfico
            myChart.setOption(option);

            // Guardar una imagen del gráfico
            const dataURL = canvas.toDataURL('image/png');


            const alertasGuardadas1 = contarAlertasPorTipo(date, alertas, type, workplaces[0], general);
            const alertasGuardadas2 = contarAlertasPorTipo(date, alertas, type, workplaces[1], general);

            const option2 = {
                title: {
                    text: '',
                },
                xAxis: {
                    data: ['55-60', '60-65', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100', '100-105', '105-110', '110-115', '115-120', '120-125', '125-130', '130-135', '135-140'],
                    axisLabel: {
                        rotate: 45, // Gira las etiquetas en un ángulo de 45 grados
                        fontSize: 10, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                yAxis: {
                    axisLabel: {
                        fontSize: 12, // Reduce el tamaño de la fuente si es necesario
                        textStyle: {
                            color: '#000', // Color de las etiquetas
                            // Otras propiedades de estilo de las etiquetas
                        },
                    },
                },
                backgroundColor: '#FFF',//'#FFA500', // Fondo blanco
                series: [
                    {
                        type: 'bar',
                        name: workplaces[0].place,
                        data: alertasGuardadas1[0],
                        barWidth: 15,
                        animation: false,
                        color: '#00b4d8',
                    },
                    {
                        type: 'bar',
                        name: workplaces[1].place,
                        data: alertasGuardadas2[0],
                        barWidth: 15,
                        color: '#2a9d8f',
                        animation: false,
                    },
                ],
                legend: {
                    data: [workplaces[0].place, workplaces[1].place],
                    textStyle: {
                        color: '#000',
                    },
                },
            };
            myChart2.setOption(option2);

            const dataURL2 = canvas2.toDataURL('image/png');


            console.log('Imagen del gráfico guardada como "grafico.png"');
            let porcentaje = 0;

            if (alertasGuardadas1[1] != 0 && alertasGuardadas2[1] != 0) {


                porcentaje = Math.floor(((alertasGuardadas1[2] + alertasGuardadas2[2]) / (alertasGuardadas1[1] + alertasGuardadas2[1])) * 100);
            } else {
                porcentaje = 40;
            }
            let data = {
                name: "nombre empresa",
                epa: 100 - porcentaje,
                no_epa: porcentaje,
                total_alert: 50,
                alert_m: 36,
                alert_u: 14

            }
            const doc = new jsPDF("p", "mm", "a4");

            //-------------Imagenes------------------------------
            doc.addImage(logo64, 'JPEG', 13, 10, 25, 25);

            //------------Figuras-------------------------------
            doc.rect(10, 40, 190, 0.001)
            doc.rect(10, 58, 190, 0.001)

            doc.setFillColor(221, 196, 33);
            doc.roundedRect(40, 65, 55, 40, 4, 4, 'F')
            doc.setFillColor(222, 113, 118);
            doc.roundedRect(115.5, 65, 55, 40, 4, 4, 'F')

            //Fondo Gráfico

            //doc.setFillColor(136);
            doc.setFillColor(0, 119, 182);
            doc.roundedRect(11, 121, 189, 72, 4, 4, 'F')

            //doc.setFillColor(255, 165, 0);
            doc.setFillColor(0, 119, 182);
            doc.roundedRect(11, 201, 189, 72, 4, 4, 'F')

            /*doc.rect(10, 112, 190, 0.001)
            doc.rect(10, 192, 190, 0.001)*/

            //-------------Texto---------------------------------
            doc.setFont("Helvetica").setFontSize(20).text(`Informe ${type} por área de trabajo`, 195, 25, { align: 'right' });
            doc.setFont("Helvetica").setFontSize(15).text(`${data.name}`, 195, 33, { align: 'right' });
            doc.setFont("Helvetica").setFontSize(13).text(`Área de trabajo: General`, 13, 47, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).text(`Total de trabajadores: ${workplaces[0].workers + workplaces[1].workers}`, 13, 53, { align: 'left' });

            if (type === "semanal") {
                let auxDate = new Date();
                auxDate.setDate(date.getDate() - 7);
                let startDate = auxDate.toLocaleDateString("es-ES")
                let endDate = date.toLocaleDateString("es-ES")

                doc.setFont("Helvetica").setFontSize(13).text(`Inicio: ${startDate}`, 197, 47, { align: 'right' })
                doc.setFont("Helvetica").setFontSize(13).text(`Fin: ${endDate}`, 197, 53, { align: 'right' })

            } else if (type === "diario") {
                doc.setFont("Helvetica").setFontSize(13).text(`Día: ${formatDate}`, 197, 47, { align: 'right' })

            } else {
                let mounth = date.toLocaleDateString("es-ES", { month: 'long' })
                let year = date.toLocaleDateString("es-ES", { year: 'numeric' })
                doc.setFont("Helvetica").setFontSize(13).text(`Mes: ${mounth} ${year}`, 197, 47, { align: 'right' })
            }

            doc.setFont("Helvetica").setFontSize(35).setTextColor(255, 255, 255).text(`${data.epa}%`, 69.5, 82, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`Uso de equipo`, 67.5, 93, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`de protección auditivo`, 67.5, 98, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(35).setTextColor(255, 255, 255).text(`${data.no_epa}%`, 144.5, 82, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`No uso de equipo`, 142.5, 93, { align: 'center' });
            doc.setFont("Helvetica").setFontSize(15).setTextColor(255, 255, 255).text(`de protección auditivo`, 142.5, 98, { align: 'center' });

            doc.setFont("Helvetica").setFontSize(15).setTextColor(0, 0, 0).text("Decibeles generados durante el peridodo", 13, 120, { align: 'left' });
            doc.addImage(dataURL, 'JPEG', 13, 122, 185, 69);

            doc.setFont("Helvetica").setFontSize(15).setTextColor(0, 0, 0).text("Distribución de alertas producidas", 13, 200, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Total de alertas en el perido: ${alertasGuardadas1[3] + alertasGuardadas2[3]}`, 13, 280, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Alertas moderadas: ${alertasGuardadas1[4] + alertasGuardadas2[4]}`, 13, 285, { align: 'left' });
            doc.setFont("Helvetica").setFontSize(13).setTextColor(0, 0, 0).text(`Alertas urgentes: ${alertasGuardadas1[5] + alertasGuardadas2[5]}`, 13, 290, { align: 'left' });
            doc.addImage(dataURL2, 'JPEG', 13, 202, 185, 69);




            //Guardar pdf con nombre especifico

            doc.save(`Informe_${type}_${formatDate}_general.pdf`)

        } catch (error) {
            throw error;
        }

    }

}
