obj-m += cpu_201504420_201504448.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

test:
	sudo dmesg -C
	sudo insmod cpu_201504420_201504448.ko
	sudo rmmod cpu_201504420_201504448.ko
	dmesg
