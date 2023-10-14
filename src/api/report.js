import { collection, getDocs} from "firebase/firestore";
import { map } from "lodash";
import { bd } from "../config";

export class Reports {
    collectionName = "workplace";
    collectionName2 = "workers";

    async getAll(){
        try{
            const docRefWorkplace = collection(bd, this.collectionName);
            const docRefWorkers = collection(bd, this.collectionName2);
            const snapshopWorkplace = await getDocs(docRefWorkplace)
            const snapshopWorkers = await getDocs(docRefWorkers)

            let workplace = map(snapshopWorkplace.docs, (workplace) => {
                let cont = 0;
                snapshopWorkers.docs.forEach((worker, index) => {
                    if(workplace.data().place === worker.data().place){
                        cont += 1;
                    }
                });
                return {
                    ...workplace.data(),
                    workers: cont,
                }
            })
            return workplace;
        } catch (error){
            throw error
        }
    }

}
