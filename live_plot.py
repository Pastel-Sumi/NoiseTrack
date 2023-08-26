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

def update_plots(frame):
    a = update_plot(frame)
    return updateee

def update_plot(frame):
    """This is called by matplotlib for each plot update.

    Typically, audio callbacks happen more frequently than plot updates,
    therefore the queue tends to contain multiple blocks of audio data.

    """
    global plotdata
    global time_threshold
    global plotdata3
    global plotdata2
    global plotdata4

    while True:
        try:
            data = q.get_nowait()
        except queue.Empty:
            break
        shift = len(data)
        plotdata = np.roll(plotdata, 1, axis=0)
        plotdata3 = np.roll(plotdata3, 1, axis=0)
        plotdata[1] = np.mean(np.sort(data)[::-1][:5])
        plotdata3[1] = np.mean(np.sort(data)[::-1][:5])


        plotdata4 = np.roll(plotdata4, 1, axis=0)
        plotdata2 = np.roll(plotdata2, 1, axis=0)
        plotdata4[1] = np.mean(np.sort(data)[::-1][:5])
        plotdata2[1] = np.mean(np.sort(data)[::-1][:5])

    # Convert amplitudes to decibels
    plotdata_db = 20 * np.log10(
        np.abs(plotdata) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata) + 1e-6)

    
    for column, line in enumerate(lines):
        print(np.max(plotdata_db), "[dB]")
        line.set_ydata(plotdata_db[:, column])
        if np.any(plotdata_db[:, column] > urgent_threshold_db):
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

    plotdata3_db = 20 * np.log10(
        np.abs(plotdata3) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata3) + 1e-6)

    for column3, line3 in enumerate(lines3):
        print(np.max(plotdata3_db), "[dB]")
        line3.set_ydata(plotdata3_db[:, column3])
        if np.any(plotdata3_db[:, column3] > urgent_threshold_db):
            line3.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata3_db[:, column3] > threshold_db):
            line3.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line3.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")


    plotdata2_db = 20 * np.log10(
        np.abs(plotdata2) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata3) + 1e-6)

    for column2, line2 in enumerate(lines2):
        print(np.max(plotdata2_db), "[dB]")
        line2.set_ydata(plotdata2_db[:, column2])
        if np.any(plotdata2_db[:, column2] > urgent_threshold_db):
            line2.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata2_db[:, column2] > threshold_db):
            line2.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line2.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")


    plotdata4_db = 20 * np.log10(
        np.abs(plotdata4) / 0.0012  # amplitud de referencia
    )  # 20 * np.log10(np.abs(plotdata4) + 1e-6)

    for column4, line4 in enumerate(lines4):
        print(np.max(plotdata4_db), "[dB]")
        line4.set_ydata(plotdata4_db[:, column4])
        if np.any(plotdata4_db[:, column4] > urgent_threshold_db):
            line4.set_color("red")  # Set color to red if urgent_threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            dif = datetime.strptime(current_time, "%H:%M:%S") - time_threshold
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
            if dif.total_seconds() >= 60:  # Se sobrepaso el nivel por más de un minuto
                # Envia la notificación al módulo principal
                print("Se envió aviso urgente al sistema a las",current_time)
                send_notification(f"Se sobrepasaron los {urgent_threshold_db} dB por {dif.total_seconds()} segundos")

        # Check if any value exceeds the threshold
        elif np.any(plotdata4_db[:, column4] > threshold_db):
            line4.set_color("yellow")  # Set color to red if threshold is exceeded

            current_time = datetime.now().strftime("%H:%M:%S")
            time_threshold = datetime.strptime(current_time, "%H:%M:%S")

            # Envia la notificación al módulo principal
            print("Se envió aviso al sistema a las", current_time)
            send_notification(f"Se sobrepasaron los {threshold_db} dB a las {current_time}")
        else:
            line4.set_color("blue")  # Set color to blue if threshold is not exceeded

            current_time = datetime.now().strftime("%H:%M:%S")

            time_threshold = datetime.strptime(current_time, "%H:%M:%S")


    return updateee

def send_notification(message):
    try:
        # Establece la conexión con el módulo principal
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("localhost", 5000))
        s.sendall(message.encode())
        s.close()
    except ConnectionRefusedError:
        print("No se pudo establecer conexión con el módulo principal")
def setup_figures(args):
    if args.samplerate is None:
        device_info = sd.query_devices(args.device, "input")
        args.samplerate = device_info["default_samplerate"]

    time_threshold = datetime.strptime(datetime.now().strftime("%H:%M:%S"), "%H:%M:%S")

    length = int(11665)    
    plotdata = np.zeros((length, len(args.channels)))


    fig, ((ax, ax2), (ax3, ax4)) = plt.subplots(2, 2)
    lines = ax.plot(plotdata)
    if len(args.channels) > 1:
        ax.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )

    conversion_factor = 2333


    duration_minutes = len(plotdata) / conversion_factor

    ax.set_xlabel("Tiempo (minutos)")

    ax.axis((0, int(len(plotdata)), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax.set_ylim([0, len(plotdata)])
    ax.set_xticks(np.arange(0, len(plotdata) + 2333, 2333))
    ax.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax.set_xticklabels(np.arange(0, duration_minutes +1 , 1))
    #ax.set_xticklabels([])
    ax.yaxis.grid(True)
    ax.xaxis.grid(True)
    ax.set_ylabel("Amplitude (dB)")  # Set y-axis label


    length3 = int(11665 * 6)

    #length = int(args.window * args.samplerate / (1000 * args.downsample))
    plotdata3 = np.zeros((length3, len(args.channels)))
    lines3 = ax3.plot(plotdata3)
    if len(args.channels) > 1:
        ax3.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )


    duration_minutes3 = len(plotdata3) / conversion_factor
    ax3.set_xlabel("Tiempo (minutos)")



    ax3.axis((0, int(len(plotdata3)), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax3.set_ylim([0, len(plotdata3)])
    ax3.set_xticks(np.arange(0, len(plotdata3) + (2333*6), (2333 * 6)))
    ax3.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax3.set_xticklabels(np.arange(0, duration_minutes3 +1 , 6))
    #ax3.set_xticklabels([])
    ax3.yaxis.grid(True)
    ax3.xaxis.grid(True)
    ax3.set_ylabel("Amplitude (dB)")  # Set y-axis label




    ax3.axis((0, len(plotdata3), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax3.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    #ax3.set_xticklabels([])
    ax3.yaxis.grid(True)
    ax3.set_ylabel("Amplitude (dB)")  # Set y-axis label

    
    length2 = int(11665 * 12)

    #length = int(args.window * args.samplerate / (1000 * args.downsample))
    plotdata2 = np.zeros((length2, len(args.channels)))
    lines2 = ax2.plot(plotdata2)
    if len(args.channels) > 1:
        ax2.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )


    duration_minutes2 = len(plotdata2) / conversion_factor
    ax2.set_xlabel("Tiempo (minutos)")



    ax2.axis((0, int(len(plotdata2)), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax2.set_ylim([0, len(plotdata2)])
    ax2.set_xticks(np.arange(0, len(plotdata2) + (2333*12), (2333 * 12)))
    ax2.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax2.set_xticklabels(np.arange(0, duration_minutes2 +1 , 12))
    #ax2.set_xticklabels([])
    ax2.yaxis.grid(True)
    ax2.xaxis.grid(True)
    ax2.set_ylabel("Amplitude (dB)")  # Set y-axis label




    ax2.axis((0, len(plotdata2), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax2.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    #ax2.set_xticklabels([])
    ax2.yaxis.grid(True)
    ax2.set_ylabel("Amplitude (dB)")  # Set y-axis label



    length4 = int(11665 * 48)

    #length = int(args.window * args.samplerate / (1000 * args.downsample))
    plotdata4 = np.zeros((length4, len(args.channels)))
    lines4 = ax4.plot(plotdata4)
    if len(args.channels) > 1:
        ax4.legend(
            [f"channel {c}" for c in args.channels],
            loc="lower left",
            ncol=len(args.channels),
        )


    duration_minutes4 = len(plotdata4) / conversion_factor
    ax2.set_xlabel("Tiempo (minutos)")



    ax4.axis((0, int(len(plotdata4)), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax4.set_ylim([0, len(plotdata4)])
    ax4.set_xticks(np.arange(0, len(plotdata4) + (2333*48), (2333 * 48)))
    ax4.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    ax4.set_xticklabels(np.arange(0, duration_minutes4 +1 , 48))
    #ax2.set_xticklabels([])
    ax4.yaxis.grid(True)
    ax4.xaxis.grid(True)
    ax4.set_ylabel("Amplitude (dB)")  # Set y-axis label




    ax4.axis((0, len(plotdata4), 0, 150))  # Adjust y-axis range to -60 dB to 0 dB
    ax4.set_ylim([0, 150])  # Set y-axis limits to -60 dB to 0 dB
    #ax4.set_xticklabels([])
    ax4.yaxis.grid(True)
    ax4.set_ylabel("Amplitude (dB)")  # Set y-axis label


    return fig, ax, ax3, plotdata, lines, lines3, plotdata3, ax2, lines2, plotdata2, ax4, lines4, plotdata4



try:
    fig1, ax1, ax3, plotdata, lines, lines3, plotdata3,ax2, lines2, plotdata2, ax4, lines4, plotdata4 = setup_figures(args)
    updateee = lines + lines3 + lines2 + lines4

    #fig2, ax2, ax3, plotdata1, lines2, lines3, plotdata3 = setup_figures(args)

    stream = sd.InputStream(
        device=args.device,
        channels=max(args.channels),
        samplerate=args.samplerate,
        callback=audio_callback,
    )

    ani1 = FuncAnimation(fig1, update_plots, interval=10, blit=True)
    #ani2 = FuncAnimation(fig2, update_plot2, interval=args.interval, blit=True)
    with stream:
        plt.show()
except Exception as e:
    parser.exit(type(e).__name__ + ": " + str(e))
