import Decibel from "../models/decibel.js";

export const save = async (req, res) => {
    try {
        let count = 0;
        const { date, db, place } = req.body;
        
        // if the decibel is greater than 55 it is saved
        if(db > 5){
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
    

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}