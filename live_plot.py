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

#import dbconnect
threshold_db = 35  # Umbral en dB -50
urgent_threshold_db = 45  # Este es el umbral de urgencia en dB -10

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
    default=50,  # 200
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


def update_plot(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata
    global time_threshold

    while True:
        try:
            data = q.get_nowait()
        except queue.Empty:
            break
        shift = len(data)
        plotdata = np.roll(plotdata, -shift, axis=0)
        plotdata[-shift:, :] = data

    # Convert amplitudes to decibels
    plotdata_db = 20 * np.log10(
        np.abs(plotdata) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata) + 1e-6)

    
    for column, line in enumerate(lines):
        print(np.max(plotdata_db), "[dB]")
        line.set_ydata(plotdata_db[:, column])
        current_db = str(np.max(plotdata_db))+'[dB]'
        send_current_db(current_db)
        if np.any(plotdata_db[:, column] > urgent_threshold_db):
            line.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            
            
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            print("Se envió aviso al sistema a las", current_time)
        # Check if any value exceeds the threshold
        elif np.any(plotdata_db[:, column] > threshold_db):
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

    return lines

def send_notification(message):
    try:
        # Establece la conexión con el módulo principal
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("localhost", 5000))
        s.sendall(message.encode())
        s.close()
    except ConnectionRefusedError:
        print("No se pudo establecer conexión con el módulo principal")

def send_current_db(message):
    try:
        s= socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("localhost", 6000))
        s.sendall(message.encode())
        s.close()
    except ConnectionRefusedError:
        print("No se pudo establecer conexión con el servicio del epp_tracker")


try:
    if args.samplerate is None:
        device_info = sd.query_devices(args.device, "input")
        args.samplerate = device_info["default_samplerate"]

    time_threshold = datetime.strptime(datetime.now().strftime("%H:%M:%S"), "%H:%M:%S")

    length = int(args.window * args.samplerate / (1000 * args.downsample))
    plotdata = np.zeros((length, len(args.channels)))

    fig, ax = plt.subplots()
    lines = ax.plot(plotdata)
    if len(args.channels) > 1:
        ax.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )
    ax.axis((0, len(plotdata), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax.set_xticklabels([])
    ax.yaxis.grid(True)
    ax.set_ylabel("Amplitude (dB)")  # Set y-axis label
    fig.tight_layout(pad=0)

    stream = sd.InputStream(
        device=args.device,
        channels=max(args.channels),
        samplerate=args.samplerate,
        callback=audio_callback,
    )
    ani = FuncAnimation(fig, update_plot, interval=args.interval, blit=True)
    # with stream:
    #     plt.show()
except Exception as e:
    parser.exit(type(e).__name__ + ": " + str(e))
