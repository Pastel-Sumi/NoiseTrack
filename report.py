# sys: Librería con funciones y variables para manipular el entorno de ejecución.
import sys
# sys.stdin: Utilizado para ingreso interactivo de datos
# sys.stdin.readline(): Lee el contenido ingresado hasta que encuentra el carácter de salto de línea, o sea, hasta que se presiona saltar.
nombre = sys.stdin.readline()
# print(): Imprime datos en pantalla. Cuando Python es ejecutado como un subproceso, envía los datos al programa que invocó a Python.
print("hola", nombre)
# sys.stdout.flush(): Fuerza la salida de datos del buffer
sys.stdout.flush()