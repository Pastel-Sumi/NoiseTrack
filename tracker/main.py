import argparse
import asyncio
import json
import random
from datetime import datetime

import sounddevice
from websockets.server import serve


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
    print(sounddevice.query_devices())
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
mapping = [c - 1 for c in args.channels]


async def sound_callback(websocket):
    while True:
        msg = json.dumps(
            {
                "type": "sound",
                "data": {
                    "time": datetime.now().timestamp(),
                    "value": random.randint(0, 100),
                },
            }
        )
        await websocket.send(msg)
        await asyncio.sleep(1)


async def main():
    async with serve(sound_callback, "localhost", 8765):
        print("Server started")
        print("Emitting sound data in the URL: ws://localhost:8765")
        await asyncio.Future()


if __name__ == "__main__":
    try:
        if not args.samplerate:
            device_info = sounddevice.query_devices(args.device, "input")
            args.samplerate = device_info["default_samplerate"]

        time_threshold = datetime.strptime(
            datetime.now().strftime("%H:%M:%S"), "%H:%M:%S"
        )

        asyncio.run(main())

    except Exception as e:
        parser.exit(type(e).__name__ + ": " + str(e))
