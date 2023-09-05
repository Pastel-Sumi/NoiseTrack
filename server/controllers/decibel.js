import Decibel from "../models/decibel.js";
import net from "net";
export const save = async (req, res) => {
        let count = 0;
        const { date, db, place } = req.body;
        
        // if the decibel is greater than 55 it is saved
        if(db > 55){
          try{
            // creating the information of decibel
            const newDB = new Decibel({
                date,
                db,
                place,
            });

            // saving the decibel in the database
            const decibelSaved = await newDB.save();
          
          }catch(error){
            res.status(500).json({ message: error.message });
        }
      }


   try{
         //Always is send through socket
         const client = new net.Socket();
         const SERVER_HOST = '127.0.0.1';
         const SERVER_PORT = 6000;
        
         console.log(db);
         client.connect(SERVER_PORT, SERVER_HOST, () => {
           console.log('Conectado al servidor en', SERVER_HOST, SERVER_PORT);
          
           const message = JSON.stringify({db})
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
     }res.send(200);
  }