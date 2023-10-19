import { collection, getDocs, query, where, orderBy} from "firebase/firestore";
import { bd } from "../config";
import { map } from "lodash";

export class Measurement {
    collectionName = "decibeles";

    //microfono 1
    async getDecibels1(){
        try {
            const docRef = collection(bd, this.collectionName);
            var currentDate = new Date();
            var numberOfMlSeconds = currentDate.getTime();
            var mlSeconds = 4 * 60 * 60000; //4 horas
            var startOfToday = new Date(numberOfMlSeconds - mlSeconds); //4 horas atras del la hora y día actual 
            const q = query(docRef, where('created','>=',startOfToday),(orderBy("created", "desc")));
            const snapshop = await getDocs(q)
            return map(snapshop.docs, (doc) => doc.data());                
        } catch (error){
            throw error;
        }
    }

    //microfono 2
    async getDecibels2(){
        try {
            const docRef = collection(bd, this.collectionName);
            var currentDate = new Date();
            var numberOfMlSeconds = currentDate.getTime();
            var mlSeconds = 4 * 60 * 60000; //4 horas
            var startOfToday = new Date(numberOfMlSeconds - mlSeconds); //4 horas atras del la hora y día actual 
            const q = query(docRef, where('created','>=',startOfToday),(orderBy("created", "desc")));
            const snapshop = await getDocs(q)
            return map(snapshop.docs, (doc) => doc.data()); 
        } catch (error){
            throw error;
        }
    }
}