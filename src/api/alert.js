import { setDoc, doc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import { bd } from "../config";

export class Alerts{
    collectionName = "alerts";

    async create(image, type, place, db, workers, time ){
        try {
            const idAlert = uuidv4(); //crea id de alerta
            const date = new Date().toLocaleString();
            const created = new Date();
            const data = { id: idAlert, image, type, place, db, date, workers, time, created };
            const docRef = doc(bd, this.collectionName, idAlert);
            await setDoc(docRef, data);
        } catch (error) {
            throw error;
        }
    }

    async getAll(){
        try{
            const docRef = collection(bd, this.collectionName);
            var startOfToday = new Date(); 
            startOfToday.setHours(0,0,0,0);
            const q = query(docRef, where('created','>=',startOfToday),(orderBy("created", "desc")));
            const snapshop = await getDocs(q)
            return map(snapshop.docs, (doc) => doc.data());
        } catch (error){
            throw error
        }
    }
}
