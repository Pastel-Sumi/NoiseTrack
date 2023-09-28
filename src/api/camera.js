import { setDoc, doc, collection, getDocs, updateDoc} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import { bd } from "../config";

export class Camera{
    collectionName = "camera";

    async create(name, place, id_place){
        try {
            const idCamera = uuidv4(); //crea id de la camara
            const created = new Date();
            const data = { id: idCamera, name, place, id_place, created };
            const docRef = doc(bd, this.collectionName, idCamera);
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

    async update(id, place, id_place){
        try{
            const docRef = collection(bd, this.collectionName, id);
            await updateDoc(docRef, {place: place, id_place: id_place });
        }catch (error) {
            throw error
        }
    }
}