from ultralytics import YOLO
from PIL import Image
import os
import cv2
model = YOLO("yolov8m_custom.pt")

#model.predict(source=r"C:\Users\D4r4r\noisetrack_pmv\epptracker\test2", conf=0.6, classes=1, save=r"C:\Users\D4r4r\noisetrack_pmv\epptracker\no_epp")



def save_images_with_class(results, save_dir, class_id):
    for i, result in enumerate(results):
        if(class_id in result.boxes.cls):
            image_path = os.path.join(save_dir, f"image_{i}.jpg")
            img = Image.fromarray(result.orig_img)
            img.save(image_path)
            """  image_path = os.path.join(save_dir, f"image_{i}.jpg")
            img = result.orig_img
            img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)  # Convertir de RGB a BGR
            cv2.imwrite(image_path, img_bgr)  """
# Ruta del directorio donde se guardarán las imágenes
save_dir = r"C:\Users\Esteban\Downloads\sound_test\no_epp"
class_id = 1
#class_names = {0: 'worker', 1: 'ear_off', 2: 'ear_on'}
results = model.predict(source=r"C:\Users\Esteban\Downloads\sound_test\images", save=True, conf=0.7 )

save_images_with_class(results, save_dir, class_id)