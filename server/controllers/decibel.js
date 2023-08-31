import Decibel from "../models/decibel.js";
import net from "net";
export const save = async (req, res) => {
    try {
        let count = 0;
        const { date, db, place } = req.body;
        console.log(req.body)
        
        // if the decibel is greater than 55 it is saved
        if(db > 55){
            // creating the information of decibel
            const newDB = new Decibel({
                date,
                db,
                place,
            });

            // saving the decibel in the database
            const decibelSaved = await newDB.save();
            res.status(200).json({
                date: decibelSaved.date,
                db: decibelSaved.db,
                place: decibelSaved.place,
            });
            count += 1
        }

        //Always is send through socket
        const client = new net.Socket();
        const SERVER_HOST = 'localhost';
        const SERVER_PORT = 6000;
        
        client.connect(SERVER_PORT, SERVER_HOST, () => {
          console.log('Conectado al servidor en', SERVER_HOST, SERVER_PORT);
          
          const message = JSON.stringify({date,db,place,})
          client.write(message);
        });
        
        client.on('data', data => {
          console.log('Respuesta del servidor:', data.toString());
          client.destroy(); // Cierra la conexión después de recibir la respuesta
        });
        
        client.on('close', () => {
          console.log('Conexión cerrada');
        });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}