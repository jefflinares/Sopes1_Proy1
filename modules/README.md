# Modulos

## Contenido de archivos Makefile

```makefile
obj-m += <modulo>.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clear:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

start:
	sudo dmesg -C
	sudo insmod <modulo>.ko
	dmesg

show:
	cat /proc/<modulo>

stop:
	sudo rmmod <modulo>.ko
	dmesg

```

## Compilar archivos

```bash
make all
```

## Limpiar entorno

```bash
make clear
```

## Crear proceso

```bash
make start
```

## Mostrar contenido del archivo

```bash
make show
```

## Detener proceso

```bash
make stop
```
