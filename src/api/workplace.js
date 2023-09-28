import { setDoc, doc, collection, getDocs} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import { bd } from "../config";

export class Workerplace{
    collectionName = "workplace";

    async create(place){
        try {
            const idWorkerplace = uuidv4(); //crea id del lugar de trabajo
            const created = new Date();
            const data = { id: idWorkerplace, place, created };
            const docRef = doc(bd, this.collectionName, idWorkerplace);
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