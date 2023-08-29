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

# Conectarse a la base de datos
from pymongo import MongoClient
# Server para el stream de imagenes/frames
from http.server import BaseHTTPRequestHandler, HTTPServer


socket_frame = 0
current_db = 0
current_db_epp = 0
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
db_time_test = {
    15: 43200,
    16: 36000,
    17: 30240,
    18: 25200,
    19: 21060,
    20: 17640,
    21: 14760,
    22: 12300,
    23: 10260,
    24: 8580,
    25: 7140,
    26: 5940,
    27: 4950,
    28: 4140,
    29: 3450,
    30: 2880,
    31: 2400,
    32: 1980,
    33: 1620,
    34: 1320,
    35: 1080,
    36: 870,
    37: 690,
    38: 540,
    39: 420,
    40: 330,
    41: 270,
    42: 210,
    43: 150,
    44: 120,
    45: 90,
    46: 60,
    47: 45,
    48: 30,
    49: 15,
    50: 0,
    51: 0,
    52: 0,
    53: 0,
    54: 0,
    55: 0,
    56: 0,
    57: 0,
}

def listen_dB():
    global current_db
    global current_db_epp
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(("localhost", 6000))
        s.listen(1)
        while True:
            conn, addr = s.accept()
            data = conn.recv(1024)
            if data:
                message = data.decode()
                parte_decimal = float(message.split("[")[0])
                parte_entera = round(parte_decimal)
                current_db = parte_entera
                current_db_epp = current_db-10
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

def insert_to_db(data):
    mongo_uri = "mongodb+srv://noisetrack:gxSOOQ1JmUou0DFJ@cluster0.zojxrcv.mongodb.net/?retryWrites=true&w=majority"

    try:
        client = MongoClient(mongo_uri)
        db = client.test  # Base de datos 'test
        collection = db.photos  # Colección 'test'
        collection.insert_one(data)
    except Exception as e:
        print("Error con MongoDB", e)

class VideoStreamHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=frame')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/video':
            self._set_headers()
            try:
                while True:
                    _, buffer = cv2.imencode('.jpg', socket_frame)
                    frame_data = b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
                    self.wfile.write(frame_data)
            except KeyboardInterrupt:
                pass
            return
        else:
            self.send_error(404)


def start_video_stream_server(server_address, handler_class):
    httpd = HTTPServer(server_address, handler_class)
    print("Servidor iniciado en http://localhost:8000")
    httpd.serve_forever()

def main():
    global current_db
    global current_db_epp
    global socket_frame
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
    source_name = 'sala'

    model = YOLO("yolov8m_custom.pt")
    tracker_tracking_start_times = {}
    trackers_exceeded_limit = set()
    aux_db = 0
    for result in model.track(source, show=False, stream=True, agnostic_nms=True, verbose=False):
        
        frame = result.orig_img
        detections = sv.Detections.from_ultralytics(result)

        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)
        
        #detections = detections[(detections.class_id != 60) & (detections.class_id != 0)]

        labels = []
        for _, _, confidence, class_id, tracker_id in detections:
            
            if class_id == 1:
                aux_db = current_db
            elif class_id == 2:
                aux_db = current_db_epp
            
            label = f"#{tracker_id} {model.model.names[class_id]} {confidence:0.2f} {aux_db}[dB]"
            
            if aux_db >= 15:
                # Registra el tiempo de inicio de seguimiento si es la primera detección de este tracker_id
                if tracker_id not in tracker_tracking_start_times and class_id != 0:
                    tracker_tracking_start_times[tracker_id] = {}

                if tracker_id in tracker_tracking_start_times:
                    # Inicializa el tiempo de cada traker_id a aux_db
                    if aux_db not in tracker_tracking_start_times[tracker_id]:
                        tracker_tracking_start_times[tracker_id][aux_db] = datetime.now()
                    
                    if aux_db in tracker_tracking_start_times[tracker_id]:
                        current_time = datetime.now()
                        duration = current_time - tracker_tracking_start_times[tracker_id][aux_db]
                        label += f" ({duration.seconds} seg)"

                        # Guardar el frame si cumple que la clase sea ear_off, supere los 10 segundos y no se encuentre en los trackers que superaron el limite (para que se guarde solo 1 vez)
                        if class_id == 1:
                            if duration.seconds > db_time_test[aux_db]/8 and tracker_id not in trackers_exceeded_limit:
                                message = f" Un trabajador ha excedido el 1/8 de la exposición a {aux_db} [dB] con {duration.seconds}"
                                print(message)
                                send_notification(message)
                                trackers_exceeded_limit.add(tracker_id)
                                #image_name = f"{source_name}_{duration.seconds}s_{aux_db}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}_{len(trackers_exceeded_limit)}.jpg"
                                image_name = datetime.now().strftime("%m-%d-%Y_%H-%M-%S.jpg")
                                image_path = os.path.join(r"C:\Users\D4r4r\noisetrack_pmv\epptracker\tracker3\no_epp", image_name)
                                data = {'Lugar': source_name,
                                        'Tiempo de exposición': duration.seconds, 
                                        'Decibel expuesto': aux_db, 
                                        'Fecha y hora': datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
                                        'Cantidad de personas expuestas': len(trackers_exceeded_limit),
                                        'Ruta foto': image_path}
                                insert_to_db(data)

                                info_text = f"Lugar: {data['Lugar']}\n"
                                info_text += f"Tiempo de exposicion: {data['Tiempo de exposición']} segundos\n"
                                info_text += f"Decibel expuesto: {data['Decibel expuesto']}\n"
                                info_text += f"Fecha y hora: {data['Fecha y hora']}\n"
                                info_text += f"Cantidad de personas expuestas: {data['Cantidad de personas expuestas']} personas\n"
                                font = cv2.FONT_HERSHEY_PLAIN
                                font_scale = 1
                                font_color = (255, 128, 0) # Naranjo
                                thickness = 1
                                text_size = cv2.getTextSize(info_text, font, font_scale, thickness)[0]
                                text_x = 10
                                text_y = text_size[1] + 10
                                # Agregar el texto a la imagen
                                cv2.putText(result.orig_img, info_text, (text_x, text_y), font, font_scale, font_color, thickness)
                                
                                cv2.imwrite(image_path, result.orig_img)
            # Reset start times when current_db drops below 15
            elif aux_db < 15:
                tracker_tracking_start_times = {}    

            
            labels.append(label)
            
        
        frame = box_annotator.annotate(
            scene=frame, 
            detections=detections,
            labels=labels
        )
        
        socket_frame = frame
        #Try
        # _, buffer = cv2.imencode('.jpg', frame)
        # frame_data = b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
        # self.wfile.write(frame_data)

        #socket
        '''frame = pickle.dumps(frame)
        size = len(frame)
        p = struct.pack('!I', size)
        frame = p + frame
        connection.sendall(frame)
        '''
        #stream en una ventana de cv2
        #cv2.imshow("yolov8", frame)

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

    server_address = ('localhost', 8000)
    stream_handler = threading.Thread(target=start_video_stream_server, args=(server_address, VideoStreamHandler))
    stream_handler.daemon = True
    stream_handler.start()
    main()
