# Módulos

## Módulo CPU (task_struct [cpu](cpu/))

Método para imprimir los niveles de los procesos hijos. Obtiene el archivo y los tabs a imprimir.

```c
void print_tabs(struct seq_file *file, int tabs);
```

Método recursivo para leer cada proceso del sistema operativo. Obtiene el archivo para escribir, el proceso padre y los tabs a imprimir.

```c
void read_process(struct seq_file *file, struct task_struct *task_parent, int tabs);
```

Método que imprime los procesos y busca el proceso padre el cual la contiene la variable init_task.

```c
static int task_tree(struct seq_file *file, void *v);
```

Método que reacciona al abrir el archivo del proceso.

```c
static int cpu_proc_open(struct inode *inode, struct file *file)
```

Operaciones que realiza un archivo, al abrir, al leer, etc.

```c
static const struct file_operations cpu_fops = {
  .owner   = THIS_MODULE,
  .open    = cpu_proc_open,
  .read    = seq_read,
  .llseek  = seq_lseek,
  .release = single_release,
};
```

## Módulo de Memoria (sysinfo [memo](memo/))

Método que obtiene los datos de la memoria RAM, se obtiene el archivo en donde se escribirán los datos.

```c
static int read_memorie(struct seq_file *file, void *v)
```

Método que reacciona al abrir el archivo del proceso

```c
static int memo_open(struct inode *inode, struct file *file)
```

Operaciones que realiza un archivo, al abrir, al leer, etc.

```c
static const struct file_operations memo_fops = {
  .owner   = THIS_MODULE,
  .open    = memo_open,
  .read    = seq_read,
  .llseek  = seq_lseek,
  .release = single_release,
};
```

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

### Compilar archivos

```bash
make all
```

### Limpiar entorno

```bash
make clear
```

### Crear proceso

```bash
make start
```

### Mostrar contenido del archivo

```bash
make show
```

### Detener proceso

```bash
make stop
```
