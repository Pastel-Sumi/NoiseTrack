#!/usr/bin/env python3
"""Plot the live microphone signal(s) with matplotlib.

Matplotlib and NumPy have to be installed.

"""
import argparse
import queue
import sys
from datetime import datetime
import socket
import matplotlib.pyplot as plt
import numpy as np
import sounddevice as sd
from matplotlib.animation import FuncAnimation
import os

image_folder = "imagenes"

# Asegúrate de que la carpeta exista; si no, créala
if not os.path.exists(image_folder):
    os.makedirs(image_folder)


threshold_db = 15  # Umbral en dB -50
urgent_threshold_db = 30  # Este es el umbral de urgencia en dB -10

def int_or_str(text):
    """Helper function for argument parsing."""
    try:
        return int(text)
    except ValueError:
        return text


parser = argparse.ArgumentParser(add_help=False)
parser.add_argument(
    "-l",
    "--list-devices",
    action="store_true",
    help="show list of audio devices and exit",
)
args, remaining = parser.parse_known_args()
if args.list_devices:
    print(sd.query_devices())
    parser.exit(0)
parser = argparse.ArgumentParser(
    description=__doc__,
    formatter_class=argparse.RawDescriptionHelpFormatter,
    parents=[parser],
)
parser.add_argument(
    "channels",
    type=int,
    default=[1],
    nargs="*",
    metavar="CHANNEL",
    help="input channels to plot (default: the first)",
)
parser.add_argument(
    "-d", "--device", type=int_or_str, help="input device (numeric ID or substring)"
)
parser.add_argument(
    "-w",
    "--window",
    type=float,
    default=500,  # 200
    metavar="DURATION",
    help="visible time slot (default: %(default)s ms)",
)
parser.add_argument(
    "-i",
    "--interval",
    type=float,
    default=1000,  # 30
    help="minimum time between plot updates (default: %(default)s ms)",
)
parser.add_argument("-b", "--blocksize", type=int, help="block size (in samples)")
parser.add_argument(
    "-r", "--samplerate", type=float, help="sampling rate of audio device"
)
parser.add_argument(
    "-n",
    "--downsample",
    type=int,
    default=10,
    metavar="N",
    help="display every Nth sample (default: %(default)s)",
)
args = parser.parse_args(remaining)
if any(c < 1 for c in args.channels):
    parser.error("argument CHANNEL: must be >= 1")
mapping = [c - 1 for c in args.channels]  # Channel numbers start with 1
q = queue.Queue()

def audio_callback(indata, frames, time, status):
    """This is called (from a separate thread) for each audio block."""
    if status:
        print(status, file=sys.stderr)
    # Fancy indexing with mapping creates a (necessary!) copy:
    q.put(indata[:: args.downsample, mapping])

def update_plots(frame):
    b = update_plot(frame)
    return b
def update_plot(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata1
    global time_threshold
    global plotdata2
    global plotdata3
    global plotdata4

    while True:
        try:
            data = q.get_nowait()
        except queue.Empty:
            break
        plotdata1 = np.roll(plotdata1, 1, axis=0)
        plotdata1[1] = np.mean(np.sort(data)[::-1][:5])
        plotdata2 = np.roll(plotdata2, 1, axis=0)
        plotdata2[1] = np.mean(np.sort(data)[::-1][:5])

        plotdata3 = np.roll(plotdata3, 1, axis=0)
        plotdata3[1] = np.mean(np.sort(data)[::-1][:5])

        plotdata4 = np.roll(plotdata4, 1, axis=0)
        plotdata4[1] = np.mean(np.sort(data)[::-1][:5])

    # Convert amplitudes to decibels
    plotdata1_db = 20 * np.log10(
        np.abs(plotdata1) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata1) + 1e-6)

    
    for column, line in enumerate(lines1):
        print(np.max(plotdata1_db), "[dB]")
        line.set_ydata(plotdata1_db[:, column])
        if np.any(plotdata1_db[:, column] > urgent_threshold_db):
            line.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata1_db[:, column] > threshold_db):
            line.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

    #return lines13
    fig1.savefig(os.path.join(image_folder, 'imagen_fig1.png'))

    return lines1

def update_plot2(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata2
    global time_threshold


    # Convert amplitudes to decibels
    plotdata2_db = 20 * np.log10(
        np.abs(plotdata2) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata2) + 1e-6)

    
    for column, line in enumerate(lines2):
        print(np.max(plotdata2_db), "[dB]")
        line.set_ydata(plotdata2_db[:, column])
        if np.any(plotdata2_db[:, column] > urgent_threshold_db):
            line.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata2_db[:, column] > threshold_db):
            line.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

    #return lines23
    fig2.savefig(os.path.join(image_folder, 'imagen_fig2.png'))

    return lines2

def update_plot3(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata3
    global time_threshold


    # Convert amplitudes to decibels
    plotdata3_db = 20 * np.log10(
        np.abs(plotdata3) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata3) + 1e-6)

    
    for column, line in enumerate(lines3):
        print(np.max(plotdata3_db), "[dB]")
        line.set_ydata(plotdata3_db[:, column])
        if np.any(plotdata3_db[:, column] > urgent_threshold_db):
            line.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata3_db[:, column] > threshold_db):
            line.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

    #return lines33
    fig3.savefig(os.path.join(image_folder, 'imagen_fig3.png'))

    return lines3


def update_plot4(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata4
    global time_threshold
    global fig4


    # Convert amplitudes to decibels
    plotdata4_db = 20 * np.log10(
        np.abs(plotdata4) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata4) + 1e-6)

    
    for column, line in enumerate(lines4):
        print(np.max(plotdata4_db), "[dB]")
        line.set_ydata(plotdata4_db[:, column])
        if np.any(plotdata4_db[:, column] > urgent_threshold_db):
            line.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata4_db[:, column] > threshold_db):
            line.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

    #return lines43

    # Guarda la imagen de fig4 en la carpeta "imagenes"
    fig4.savefig(os.path.join(image_folder, 'imagen_fig4.png'))


    return lines4



def send_notification(message):
    try:
        # Establece la conexión con el módulo principal
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("localhost", 5000))
        s.sendall(message.encode())
        s.close()
    except ConnectionRefusedError:
        print("No se pudo establecer conexión con el módulo principal")

def setup_figures(args, largo, valor):
    if args.samplerate is None:
        device_info = sd.query_devices(args.device, "input")
        args.samplerate = device_info["default_samplerate"]

    time_threshold = datetime.strptime(datetime.now().strftime("%H:%M:%S"), "%H:%M:%S")

    #length = int(args.samplerate * 1)
    #length3 = int(args.samplerate * 0.1)
    length = int(largo * valor)
    conversion_factor = 2333

    #length = int(args.window * args.samplerate / (1000 * args.downsample))
    plotdata = np.zeros((length, len(args.channels)))

    fig, (ax) = plt.subplots()
    lines = ax.plot(plotdata)
    if len(args.channels) > 1:
        ax.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )
    # Calcula la duración en minutos de tus datos
    duration_minutes = len(plotdata) / conversion_factor

    ax.set_xlabel("Tiempo (minutos)")
    if(largo*valor< 2333*30+100):
        ax.set_title("Gráfico de "+str(int(largo*valor/2333)) +" minutos")
    elif (int(largo*valor/(2333*60)) == 1):
        ax.set_title("Gráfico de "+str(int(largo*valor/(2333*60))) +" hora")
    else:
        ax.set_title("Gráfico de "+str(int(largo*valor/(2333*60))) +" horas")

    

    ax.axis((0, int(len(plotdata)), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax.set_ylim([0, len(plotdata)])
    ax.set_xticks(np.arange(0, len(plotdata) + (2333*valor), (2333*valor)))
    ax.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax.set_xticklabels(np.arange(0, duration_minutes +1 , valor).astype(int))
    #ax.set_xticklabels([])
    ax.yaxis.grid(True)
    ax.xaxis.grid(True)
    ax.set_ylabel("Amplitude (dB)")  # Set y-axis label
   





    #fig.tight_layout(pad=0)

    return fig, ax, plotdata, lines,
try:
    fig1, ax1, plotdata1, lines1 = setup_figures(args,11665, 1)
    fig2, ax2, plotdata2, lines2 = setup_figures(args,11665, 6)
    fig3, ax3, plotdata3, lines3 = setup_figures(args,11665, 12)
    fig4, ax4, plotdata4, lines4 = setup_figures(args,11665, 48)

    # Crear un objeto de flujo de audio
    stream = sd.InputStream(
        device=args.device,
        channels=max(args.channels),
        samplerate=args.samplerate,
        callback=audio_callback,
    )

    # Crear las animaciones para ambas figuras
    ani1 = FuncAnimation(fig1, update_plot, interval=args.interval, blit=True)
    ani2 = FuncAnimation(fig2, update_plot2, interval=args.interval, blit=True)
    ani3 = FuncAnimation(fig3, update_plot3, interval=args.interval, blit=True)
    ani4 = FuncAnimation(fig4, update_plot4, interval=args.interval, blit=True)


    # Iniciar el flujo de audio
    with stream:
        # Mostrar ambas figuras
        plt.show()
except Exception as e:
    parser.exit(type(e).__name__ + ": " + str(e))
