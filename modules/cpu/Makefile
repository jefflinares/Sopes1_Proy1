obj-m += cpu_201504420_201504448.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clear:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

start:
	sudo dmesg -C
	sudo insmod cpu_201504420_201504448.ko
	dmesg

show:
	cat /proc/cpu_201504420_201504448

stop:
	sudo rmmod cpu_201504420_201504448.ko
	dmesg
