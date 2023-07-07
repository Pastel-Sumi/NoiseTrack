import socket
import threading
import time

def handle_notification(message):
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
