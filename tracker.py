# tracker
from ultralytics import YOLO
import supervision as sv
import numpy as np
import cv2
import threading
from supervision.draw.color import ColorPalette

import os
from datetime import datetime
import time

import requests

import base64
import multiprocessing
from multiprocessing import Queue

# Server para el stream de imagenes/frames
import socket
import socketio
import eventlet
from http.server import BaseHTTPRequestHandler, HTTPServer

#firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid
cred = credentials.Certificate("noisetrack2-firebase-adminsdk-9jtjm-df8b88271f.json")
firebase_admin.initialize_app(cred)


sio = socketio.Server(cors_allowed_origins='*')

current_db = 85
current_db_epp = 0

current_db2 = 85
current_db2_epp = 0

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
    42: 200,
    43: 150,
    44: 120,
    45: 900,
    46: 600,
    47: 450,
    48: 300,
    49: 150,
    50: 150,
    51: 150,
    52: 150,
    53: 150,
    54: 150,
    55: 150,
    56: 150,
    57: 150,
    58: 150,
    59: 150,
    60: 150,
    61: 150,
    62: 150,
    63: 150,
    64: 150,
    65: 150,
    66: 150,
    67: 150,
    68: 150,
    69: 150,
    70: 150,
    71: 150,
    72: 150,
    73: 150,
    74: 150,
    75: 150,
    76: 150,
    77: 150,
    78: 150,
    79: 150,
    80: 150,
    81: 150,
    82: 150,
    83: 150,
    84: 150,
    85: 40,
    86: 150,
    87: 150,
    88: 150,
    89: 150,
    90: 150,
    91: 150,
    92: 150,
    93: 150,
    94: 150,
    95: 150,
    96: 150,
    97: 150,
    98: 150,
    99: 150,
    100: 80,
    101: 150,
    102: 150,
    103: 150,
    104: 150,
    105: 150,
    106: 150,
    107: 150,
    108: 150,
    109: 150,
    110: 150,
    111: 150,
    112: 150,
    113: 150,
    114: 150,
    115: 150,
    116: 150,
    117: 150,
    118: 150,
    119: 150,
    120: 150,



}


#Traer mensajes desde la aplicación (Handler que siempre está escuchando).
@sio.on('message')
def handler_message(sio, data):
    global current_db, current_db2, current_db2_epp, current_db_epp
    if(data[0]=='1'):
        #pass
        current_db = round(float(data[2:]))
        current_db_epp = current_db - 10
    elif(data[0]=='2'):
        current_db2 = round(float(data[2:]))
        current_db2_epp = current_db2 - 10
        #pass

frame_queue_1 = Queue()
frame_queue_2 = Queue()
    
    
# Handler para enviar los frames a un socket.
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
                    _, buffer = cv2.imencode('.jpg', frame_queue_1.get())
                    frame_data = b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
                    self.wfile.write(frame_data)
            except Exception as e:
                #print(f"Error: {e}")
                pass
            return
        else:
            self.send_error(404)

class VideoStreamHandler2(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=frame')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/video':
            self._set_headers()
            try:
                while True:
                    _, buffer = cv2.imencode('.jpg', frame_queue_2.get())
                    frame_data = b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
                    self.wfile.write(frame_data)
            except KeyboardInterrupt:
                pass
            return
        else:
            self.send_error(404)


# Define una función para guardar la imagen y luego insertar datos en la base de datos
def save_image_and_insert_to_db(image_data, data):
    def save_data():
        try:
            image_base64 = base64.b64encode(cv2.imencode('.jpg', image_data)[1]).decode()
            data["image"] = image_base64
            uid = uuid.uuid4().hex
            db = firestore.client()
            data["id"] = uid
            ref = db.collection('alerts').document(uid)
            ref.set(data)
            #insertar en firebase
            print("Exito al guardar")
            
        except Exception as e:
            print("Error al insertar en firebase", e)
    save_thread = threading.Thread(target=save_data)
    save_thread.start()

def start_video_stream_server(server_address, handler_class):
    httpd = HTTPServer(server_address, handler_class)
    print(f"Servidor iniciado en {server_address}")
    httpd.serve_forever()


def camera_process(source_name, source, frame_queue):
    global current_db, current_db_epp, current_db2, current_db2_epp
    global socket_frame_1, socket_frame_2
    class_colors = {
        0: sv.Color(0, 0, 255),   # Azul
        1: sv.Color(255, 0, 0),   # Rojo
        2: sv.Color(0, 255, 0),   # Verde
        
    }
    color_palette = ColorPalette(colors=class_colors)

    box_annotator = sv.BoxAnnotator(
        color=color_palette,
        thickness=3,
        text_thickness=1,
        text_scale=1
    )

    model = YOLO("yolov8m_custom.pt")
    tracker_tracking_start_times = {}
    trackers_exceeded_limit_8 = set()
    trackers_exceeded_limit = set()
    aux_db = 0
    date_time = datetime.now().strftime("%m-%d-%Y, %H:%M:%S")
    created = datetime.now()
    workers = set()
    tracker_timers = {}
    flag = True
    for result in model.track(source, show=False, stream=True, persist=True, agnostic_nms=True, verbose=False,show_conf=False, conf=0.7, save=False, classes=[0,1,2]):
        
        frame = result.orig_img
        detections = sv.Detections.from_ultralytics(result)

        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)
        
        #detections = detections[(detections.class_id != 60) & (detections.class_id != 0)]

        labels = []
        for _, _, confidence, class_id, tracker_id in detections:
            #print(len(detections[detections.class_id == 1]))
            if source_name == "Camera 1":
                if class_id == 1:
                    aux_db = current_db
                elif class_id == 2:
                    aux_db = current_db_epp
            else:
                if class_id == 1:
                    aux_db = current_db2
                elif class_id == 2:
                    aux_db = current_db2_epp
            
            text_color = 0

            show_text_bottom_left = False
            if aux_db > 80:
                show_text_bottom_left = True
                text_color = (0, 0, 255)  # Rojo

            # Agrega el texto en la esquina inferior izquierda si es necesario.
            if show_text_bottom_left:
                text = "USO DE EPP NECESARIO"  # Reemplaza con el texto que deseas mostrar
                font = cv2.FONT_HERSHEY_PLAIN
                font_scale = 3
                thickness = 2

                text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
                text_x = 10
                text_y = frame.shape[0] - text_size[1] - 10

                # Agrega el texto con el color correspondiente.
                cv2.putText(frame, text, (text_x, text_y), font, font_scale, text_color, thickness)

            label = f"#{tracker_id} {model.model.names[class_id]} {aux_db}[dB]"
            
            if class_id == 0 and tracker_id not in workers:
                workers.add(tracker_id)

            font = cv2.FONT_HERSHEY_PLAIN
            font_scale = 3
            font_color = (0, 0, 255)  # Color rojo
            thickness = 1

            # Convierte el conteo a texto.
            count_text = f"Trabajadores: {len(workers)}"

            # Calcula la posición para el texto en la esquina inferior derecha.
            text_size = cv2.getTextSize(count_text, font, font_scale, thickness)[0]
            text_x = frame.shape[1] - text_size[0] - 10
            text_y = frame.shape[0] - 10

            # Agrega el texto a la imagen.
            cv2.putText(frame, count_text, (text_x, text_y), font, font_scale, font_color, thickness)

            if aux_db >= 15:
                # Registra el tiempo de inicio de seguimiento si es la primera detección de este tracker_id
                if tracker_id not in tracker_tracking_start_times and class_id != 0:
                    tracker_tracking_start_times[tracker_id] = {}

                if tracker_id in tracker_tracking_start_times:
                    # Inicializa el tiempo de cada traker_id a aux_db
                    if aux_db not in tracker_tracking_start_times[tracker_id]:
                        tracker_tracking_start_times[tracker_id][aux_db] = datetime.now()
                        #{'tracker_1': { '15': 'date'}, { '16' : 'date'}}
                    
                    if aux_db in tracker_tracking_start_times[tracker_id]:
                        current_time = datetime.now()
                        duration = current_time - tracker_tracking_start_times[tracker_id][aux_db]
                        label += f" ({duration.seconds} seg)"
                        place = ""
                        if source_name == 'Camera 1':
                            place = "Sala 1"
                        else:
                            place = "Sala 2"
                        # Guardar el frame si cumple que la clase sea ear_off, supere los 10 segundos y no se encuentre en los trackers que superaron el limite (para que se guarde solo 1 vez)
                        if class_id == 1:
                            if duration.seconds > db_time_test[aux_db]/8 and tracker_id not in trackers_exceeded_limit_8:
                                message = f" Un trabajador ha excedido el 1/8 de la exposición a {aux_db} [dB] con {duration.seconds}"
                                #print(message)
                                
                                trackers_exceeded_limit_8.add(tracker_id)
                                data = {
                                        'time': duration.seconds, 
                                        'db': aux_db, 
                                        'date': date_time,
                                        'workers': len(detections[detections.class_id == 0]),
                                        'workers_epp': len(detections[detections.class_id == 2]),
                                        'workers_no_epp': len(detections[detections.class_id == 1]),
                                        'created': created,
                                        'place': place,
                                        'type': 1,
                                        }
                                
                                info_text = f"Lugar: {data['place']}\n"
                                info_text += f"Tiempo de exposicion: {data['time']} segundos\n"
                                info_text += f"Decibel expuesto: {data['db']}\n"
                                info_text += f"Fecha y hora: {data['date']}\n"
                                info_text += f"Cantidad de personas expuestas: {data['workers']} personas\n"
                                notification_text = f"Tipo de Alerta: {data['type']}\n" + info_text 

                                font = cv2.FONT_HERSHEY_PLAIN
                                font_scale = 1
                                font_color = (255, 128, 0)  # Naranjo
                                thickness = 1

                                # Separar el texto en líneas
                                lines = notification_text.split('\n')

                                text_x = 10
                                text_y = 10  # Comenzar desde arriba

                                # Agregar cada línea del texto a la imagen
                                for line in lines:
                                    text_size = cv2.getTextSize(line, font, font_scale, thickness)[0]
                                    cv2.putText(result.orig_img, line, (text_x, text_y), font, font_scale, font_color, thickness)
                                    text_y += text_size[1] + 5  # Espacio entre líneas
                                

                                save_image_and_insert_to_db(result.orig_img, data)
                        
                        if duration.seconds > db_time_test[aux_db] and tracker_id not in trackers_exceeded_limit:
                            message = f" Un trabajador ha excedido tiempo de la exposición a {aux_db} [dB] con {duration.seconds}"
                            #print(message)
                            if aux_db not in tracker_timers.get(tracker_id, {}):
                                #resp = requests.get('https://192.168.18.211/on')
                                
                                if flag:
                                    print("on at", time.time())
                                    resp = requests.get('http://192.168.137.221/on')
                                    flag = False
                                    tracker_timers[tracker_id] = {aux_db: time.time()}
                            trackers_exceeded_limit.add(tracker_id)
                            data = {
                                    'time': duration.seconds, 
                                    'db': aux_db, 
                                    'date': date_time,
                                    'workers': len(trackers_exceeded_limit_8),
                                    'created': created,
                                    'place': place,
                                    'type': 2,
                                    }
                            info_text = f"Lugar: {data['place']}\n"
                            info_text += f"Tiempo de exposicion: {data['time']} segundos\n"
                            info_text += f"Decibel expuesto: {data['db']}\n"
                            info_text += f"Fecha y hora: {data['date']}\n"
                            info_text += f"Cantidad de personas expuestas: {data['workers']} personas\n"
                            notification_text = f"Tipo de Alerta: {data['type']}\n" + info_text 
                            #send_notification(notification_text)
                            font = cv2.FONT_HERSHEY_PLAIN
                            font_scale = 1
                            font_color = (255, 128, 0)  # Naranjo
                            thickness = 1

                            # Separar el texto en líneas
                            lines = notification_text.split('\n')

                            text_x = 10
                            text_y = 10  # Comenzar desde arriba

                            # Agregar cada línea del texto a la imagen
                            for line in lines:
                                text_size = cv2.getTextSize(line, font, font_scale, thickness)[0]
                                cv2.putText(result.orig_img, line, (text_x, text_y), font, font_scale, font_color, thickness)
                                text_y += text_size[1] + 5  # Espacio entre líneas
                            
                            
                            save_image_and_insert_to_db(result.orig_img, data)
                        if aux_db in tracker_timers.get(tracker_id, {}):
                            elapsed_time = time.time() - tracker_timers[tracker_id][aux_db]
                            
                            if elapsed_time >= 10:
                                print("off at", time.time())
                                resp = requests.get('http://192.168.137.221/off')
                                del tracker_timers[tracker_id] #reiniciar el contador
                                flag = True
            # Reset start times when current_db drops below 15
            elif aux_db < 15:
                tracker_tracking_start_times = {}
    

            
            labels.append(label)
            
        
        frame = box_annotator.annotate(
            scene=frame, 
            detections=detections,
            labels=labels
        )
        re_frame = cv2.resize(frame, (1280, 720))
        # if source_name == "Camera 1":
        #     socket_frame_1 = re_frame
        # elif source_name == "Camera 2":
        #     socket_frame_2 = re_frame
        #stream en una ventana de cv2
        
        #cv2.imshow(f"{source_name}", re_frame)

        frame_queue.put(re_frame)

        for tracker_id in tracker_tracking_start_times.copy():
            if tracker_id not in [tracker_id for _, _, _, _, tracker_id in detections]:
                del tracker_tracking_start_times[tracker_id]
                trackers_exceeded_limit.discard(tracker_id)
                trackers_exceeded_limit_8.discard(tracker_id)
        
        for tracker_id in workers.copy():
            if tracker_id not in [tracker_id for _, _, _, _, tracker_id in detections]:
                workers.discard(tracker_id)
        
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break


def main():
    camera_source_1 = "rtsp://camera1:noisetrack6@192.168.137.69:88/videoMain"
    camera_source_2 = "rtsp://camera2:noisetrack6@192.168.137.130:88/videoMain"

    camera1_thread = multiprocessing.Process(target=camera_process, args=("Camera 1", camera_source_1, frame_queue_1))
    camera2_thread = multiprocessing.Process(target=camera_process, args=("Camera 2", camera_source_2, frame_queue_2))

    # Iniciar los hilos
    camera1_thread.start()
    camera2_thread.start()

    app = socketio.WSGIApp(sio)
    eventlet.wsgi.server(eventlet.listen(('localhost', 6001)), app,log=open(os.devnull,"w"))

    # Esperar a que los hilos terminen (puedes agregar manejo de señales para detenerlos)
    camera1_thread.join()
    camera2_thread.join()

if __name__ == "__main__":
    
    server_address = ('localhost', 8000)
    stream_handler = threading.Thread(target=start_video_stream_server, args=(server_address, VideoStreamHandler))
    stream_handler.daemon = True
    stream_handler.start()

    server_address2 = ('localhost', 8001)
    stream_handler2 = threading.Thread(target=start_video_stream_server, args=(server_address2, VideoStreamHandler2))
    stream_handler2.daemon = True
    stream_handler2.start()

    main()