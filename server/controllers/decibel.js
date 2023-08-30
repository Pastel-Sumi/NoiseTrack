import Decibel from "../models/decibel.js";

export const save = async (req, res) => {
    try {
        let count = 0;
        console.lo
        for(let i=0; i < req.body.length; i++){
            const { date, db, place } = req.body[0];
            if(db > 5){
                count += 1;
            }
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
            }
            

            //Always is send through socket
        }

        console.log(count)
        res.json({
            date: decibelSaved.date,
            db: decibelSaved.db,
            place: decibelSaved.place,
        });
        

        

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}