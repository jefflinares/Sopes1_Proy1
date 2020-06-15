// http://sop.upv.es/gii-dso/es/t3-procesos-en-linux/gen-t3-procesos-en-linux.html
// https://devarea.com/linux-kernel-development-creating-a-proc-file-and-interfacing-with-user-space/#.Xt7bCM9KiNI
// https://kernelnewbies.org/Documents/SeqFileHowTo
// https://tuxthink.blogspot.com/2013/10/creating-read-write-proc-entry-in.html?m=1
// https://www.tldp.org/LDP/lki/lki-2.html

#include <linux/fs.h>
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/list.h>
#include <linux/seq_file.h>
#include <linux/list.h>
#include <linux/proc_fs.h>
#include <linux/slab.h>
#include <linux/string.h>
#include <linux/types.h>

/*
 * Metodo para imprimir los tabs dentro del archivo
 */
void print_tabs(struct seq_file *file, int tabs) {
  int i;
  if (tabs > 0) {
    seq_printf(file, "|");
    for (i = 0; i < tabs; i++) seq_printf(file, "---");
  }
}

/*
 * Metodo recursivo para leer cada proceso
 */
void read_process(struct seq_file *file, struct task_struct *task_parent, int tabs) {
  struct task_struct *task_children;
  struct list_head *list_current;
  char state[50];

  switch(task_parent->state) {
    case TASK_RUNNING:
	    strcpy(state, "Running");
	    break;
    case TASK_INTERRUPTIBLE:
      strcpy(state,"Interruptible");
      break;
    case TASK_UNINTERRUPTIBLE:
      strcpy(state,"Uninterrumpible");
      break;
    case EXIT_ZOMBIE:
      strcpy(state, "Zombie");
      break;
    case TASK_STOPPED:
      strcpy(state, "Stopped");
      break;
    default:
      strcpy(state, "Unknown");
  }

  print_tabs(file, tabs);
  seq_printf(
    file,
    "├── PID: %-10d \tNombre: %-20s \tEstado: %-20s\n",
    task_parent->pid, task_parent->comm, state
  );

  list_for_each(list_current, &task_parent->children) {
    task_children = list_entry(list_current, struct task_struct, sibling);
    read_process(file, task_children, tabs + 1);
  }
}

/*
 * Metodo que imprime los procesos y busca el proceso padre
 * el cual la contiene la variable init_task
 */
static int task_tree(struct seq_file *file, void *v) {
  seq_printf(file, "\t\t ___________________________________________ \n");
  seq_printf(file, "\t\t|                                           |\n");
  seq_printf(file, "\t\t| Ronald Neftali Berdúo Morales - 201504420 |\n");
  seq_printf(file, "\t\t| Jefferson Linares Cerón       - 201504448 |\n");
  seq_printf(file, "\t\t|___________________________________________|\n\n\n");
  read_process(file, &init_task, 0);
  return 0;
}

/*
 * Metodo que reacciona al abrir el archivo del proceso
 */
static int cpu_proc_open(struct inode *inode, struct file *file) {
  return single_open(file, task_tree, NULL);
}

/*
 * operaciones que realiza un archivo, al abrir, al leer, etc.
 */
static const struct file_operations cpu_fops = {
  .owner   = THIS_MODULE,
  .open    = cpu_proc_open,
  .read    = seq_read,
  .llseek  = seq_lseek,
  .release = single_release,
};

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Ronald Berdúo - Jefferson Linares");
MODULE_DESCRIPTION("Módulo CPU(task_struct)");
MODULE_VERSION("0.1.0");

/*
 * Inicio del modulo, imprime los nombres y crea el proceso
 */
static int __init cpu_201504420_201504448_init(void) {
  printk(KERN_INFO "Nombres:\n\tRonald Neftali Berdúo Morales\n\tJefferson Linares Cerón\n");
  proc_create("cpu_201504420_201504448", 0, NULL, &cpu_fops);
  return 0;
}

/*
 * Salida del modulo, elimina el proceso e imprime el nombre del curso
 */
static void __exit cpu_201504420_201504448_exit(void) {
  remove_proc_entry("cpu_201504420_201504448", NULL);
  printk(KERN_INFO "Sistemas operativos 1\n");
}

module_init(cpu_201504420_201504448_init);
module_exit(cpu_201504420_201504448_exit);