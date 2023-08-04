# NoiseTrack
Repositorio de NoiseTrack, proyecto para la feria de software de Roku6its.

## Instalación

### Audio
Para la parte de audio se debe de instalar la biblioteca `sounddevice` mediante el comando

    pip install sounddevice

Ahora para ejecutar primero debemos ejecutar el archivo `main_module.py` seguido de `live_plot.py`.

* Podemos elegir la source a utilizar de nuestro equipo con el comando `python main_module.py -x` donde x es el número del 'device a utilizar'. 

### IA
Para poder instalar y ejecutar el programa hay que instalar la biblioteca `ultralytics`. En otras palabras, instalar la biblioteca utilizando el comando en consola:

    pip install ultralytics

Además debemos de tener instalado cuda en nuestro equipo (para más detalles ver apartado de IA en la wiki).
Finalmente, ejecutar el programa con el comando `python test.py`
