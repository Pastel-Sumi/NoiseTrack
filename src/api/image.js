import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export class Image {
  async uploadFile(file, folder, nameFile) {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `${folder}/${nameFile}`);

      const metadata = { contentType: "image/jpg"};
      const fileBuffer = await file.arrayBuffer();

      return await uploadBytes(fileRef, fileBuffer, metadata);
    } catch (error) {
      throw error;
    }
  }

  async getUrlFile(pathFile) {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, pathFile);
      return await getDownloadURL(fileRef);
    } catch (error) {
      throw error;
    }
  }
}