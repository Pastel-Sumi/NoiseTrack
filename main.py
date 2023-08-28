from ultralytics import YOLO
import supervision as sv
import numpy as np
import cv2
import threading

import os
from datetime import datetime
from supervision.draw.color import ColorPalette

import socket
#import pickle
#import struct
#import streamlit as st

current_db = 0
db_time = {
    85: 28800,
    86: 22860,
    87: 18144,
    88: 14400,
    89: 11412,
    90: 9072,
    91: 7200,
    92: 5724,
    93: 4536,
    94: 3600,
    95: 2844,
    96: 2268,
    97: 1800,
    98: 1428,
    99: 1134,
    100: 900,
    101: 714,
    102: 564,
    103: 450,
    104: 354,
    105: 282,
    106: 225,
    107: 178.2,
    108: 141.6,
    109: 112.8,
    110: 89.4,
    111: 70.8,
    112: 56.4,
    113: 44.64,
    114: 35.43,
    115: 29,
}

def listen_dB():
    global current_db
    # Restricciones para class_id = 1
    db_offset_for_ear_off = 10
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(("localhost", 6000))
        s.listen(1)
        while True:
            conn, addr = s.accept()
            data = conn.recv(1024)
            if data:
                message = data.decode()
                print(message)
                current_db =message

            conn.close()
    except OSError as e:
        print("Error al establecer la conexión:", str(e))

def send_notification(message):
    try:
        # Establece la conexión con el módulo principal
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("localhost", 5000))
        s.sendall(message.encode())
        s.close()
    except ConnectionRefusedError:
        print("No se pudo establecer conexión con el módulo principal")

def main():
    global current_db
    
    #streamlit
    #frame_placeholder = st.empty()
    '''server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('127.0.0.1', 8080))
    server_socket.listen(1)
    print("Esperando conexión...")
    connection, client_address = server_socket.accept()
    print("cliente conectado:", client_address)
    '''
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
            label = f"#{tracker_id} {model.model.names[class_id]} {confidence:0.2f} {current_db}"
            
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
                    image_path = os.path.join(r"C:\Users\D4r4r\noisetrack_pmv\epptracker\tracker3", image_name)
                    cv2.imwrite(image_path, result.orig_img)

            
            labels.append(label)
            
        
        frame = box_annotator.annotate(
            scene=frame, 
            detections=detections,
            labels=labels
        )
        
        #socket
        '''frame = pickle.dumps(frame)
        size = len(frame)
        p = struct.pack('!I', size)
        frame = p + frame
        connection.sendall(frame)
        '''
        #stream en una ventana de cv2
        cv2.imshow("yolov8", frame)

        #streamlit
        #frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        #frame_placeholder.image(frame)

        for tracker_id in tracker_tracking_start_times.copy():
            if tracker_id not in [tracker_id for _, _, _, _, tracker_id in detections]:
                del tracker_tracking_start_times[tracker_id]
                trackers_exceeded_limit.discard(tracker_id)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break


if __name__ == "__main__":
    notification_thread = threading.Thread(target=listen_dB)
    notification_thread.daemon = True
    notification_thread.start()   
    main()
    
    