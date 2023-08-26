from ultralytics import YOLO
import supervision as sv
import numpy as np
import cv2
import os
from PIL import Image
from datetime import datetime
from supervision.draw.color import ColorPalette
import streamlit as st



def main():
    
    frame_placeholder = st.empty()

    class_colors = {
        0: sv.Color(0, 0, 255),   # Azul
        1: sv.Color(255, 0, 0),   # Rojo
        2: sv.Color(0, 255, 0),   # Verde
        
    }
    color_palette = ColorPalette(colors=class_colors)

    box_annotator = sv.BoxAnnotator(
        color=color_palette,
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )
    source = 0

    model = YOLO("yolov8m_custom.pt")
    tracker_tracking_start_times = {}
    trackers_exceeded_limit = set()
    for result in model.track(source, show=False, stream=True, agnostic_nms=True, verbose=False):
        
        frame = result.orig_img
        detections = sv.Detections.from_ultralytics(result)

        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)
        
        #detections = detections[(detections.class_id != 60) & (detections.class_id != 0)]

        labels = []
        for _, _, confidence, class_id, tracker_id in detections:
            label = f"#{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
            
            # Registra el tiempo de inicio de seguimiento si es la primera detección de este tracker_id
            if tracker_id not in tracker_tracking_start_times:
                tracker_tracking_start_times[tracker_id] = datetime.now()

            # Calcula y agrega la duración de seguimiento al label
            if tracker_id in tracker_tracking_start_times:
                current_time = datetime.now()
                duration = current_time - tracker_tracking_start_times[tracker_id]
                label += f" ({duration.seconds} seg)"

                 # Guardar el frame si cumple que la clase sea ear_off, supere los 10 segundos y no se encuentre en los trackers que superaron el limite (para que se guarde solo 1 vez)
                if class_id == 1 and duration.seconds > 10 and tracker_id not in trackers_exceeded_limit:
                    print(f"Un trabajador ha pasado 60 segundos.")
                    trackers_exceeded_limit.add(tracker_id)

            
                    image_name = f"{source}_{duration.seconds}s_xdB_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}_{len(trackers_exceeded_limit)}.jpg"
                    image_path = os.path.join(r"C:\Users\Esteban\Downloads\NoiseTrack", image_name)
                    cv2.imwrite(image_path, result.orig_img)
            
            labels.append(label)
            
        
        frame = box_annotator.annotate(
            scene=frame, 
            detections=detections,
            labels=labels
        )

        

        #cv2.imshow("yolov8", frame)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame)

        for tracker_id in tracker_tracking_start_times.copy():
            if tracker_id not in [tracker_id for _, _, _, _, tracker_id in detections]:
                del tracker_tracking_start_times[tracker_id]
                trackers_exceeded_limit.discard(tracker_id)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break


if __name__ == "__main__":
    main()