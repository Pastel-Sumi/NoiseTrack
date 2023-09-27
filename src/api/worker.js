import { setDoc, doc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import { bd } from "../config";

export class Worker{
    collectionName = "workers";

    async create(email, username, place){
        try {
            const idWorker = uuidv4(); //crea id del trabajador
            const created = new Date();
            const data = { id: idWorker, email, username, place, created };
            const docRef = doc(bd, this.collectionName, idWorker);
            await setDoc(docRef, data);
        } catch (error) {
            throw error;
        }
    }

    async getAll(){
        try{
            const docRef = collection(bd, this.collectionName);
            const snapshop = await getDocs(docRef)
            return map(snapshop.docs, (doc) => doc.data());
        } catch (error){
            throw error
        }
    }
}