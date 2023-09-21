import Decibel from "../models/decibels";

export class Measurement {
    async getDecibels(){
        try {
            const db = 85
            console.log(Decibel)
            const decibelFound = await Decibel.find({})
            
            if(decibelFound){
                console.log(decibelFound)
            }
        } catch (error){
            throw error;
        }
    }
}