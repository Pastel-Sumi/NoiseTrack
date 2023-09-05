from twilio.rest import Client
import socket
import threading
import time

#Solo hay que instalar la biblioteca de twilio con pip install twilio

#Estas dos cosas son las que me entrega la plataforma de twilio al crear una cuenta.
TWILIO_ACCOUND_SID='ACb59f7c0c1b7c0e6c19760c846f59c203'
TWILIO_AUTH_TOKEN = '1852e0887af58f1909b4ed17e2fa54b6'
#Creamos el cliente con los respectivos campos de autenticacion
client = Client(TWILIO_ACCOUND_SID, TWILIO_AUTH_TOKEN)

#Por el momento, por como funciona esto, el from whatsapp number no se puede cambiar.
# El to, aparentemente tiene que estar dentro del sandbox de twilio (revisar la pag).
from_whatsapp_number ='whatsapp:+14155238886'
to_whatsapp_number='whatsapp:+56948159646'

#Self-explanatory: Esto es lo que manda el mensaje


def handle_notification(message):
    client.messages.create(body=message, from_=from_whatsapp_number,to=to_whatsapp_number)
    print(f"Mensaje recibido: {message}")

def listen_for_notifications():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(("localhost", 5000))
        s.listen(1)
        while True:
            conn, addr = s.accept()
            data = conn.recv(1024)
            if data:
                message = data.decode()
                handle_notification(message)
            conn.close()
    except OSError as e:
        print("Error al establecer la conexión:", str(e))


if __name__ == "__main__":
    notification_thread = threading.Thread(target=listen_for_notifications)
    notification_thread.daemon = True
    notification_thread.start()

    while True:
        time.sleep(1)
