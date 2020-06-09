// https://www.tutorialspoint.com/unix_system_calls/sysinfo.htm
// https://man7.org/linux/man-pages/man2/sysinfo.2.html
// https://www.informit.com/articles/article.aspx?p=23618&seqNum=15
// https://kernelnewbies.org/MemoryIssues

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
#include <linux/mm.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/quicklist.h>
#include <linux/syscalls.h>
#include <linux/swap.h>
#include <linux/swapfile.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>

#define MEGABYTE 1024

/*
 * Metodo que obtiene los datos de la memoria RAM
 */
static int read_memorie(struct seq_file *file, void *v) {
  #define convert(x) ((x) << (PAGE_SHIFT - 10))
  struct sysinfo info;
  long totalram;
  long freeram;
  long used_percent;
  si_meminfo(&info);
  totalram = convert(info.totalram) / MEGABYTE;
  freeram = convert(info.freeram) / MEGABYTE;
  used_percent = (((totalram - freeram)*100) / (totalram) * 100) / 100;
	seq_printf(file, "Carnet:            201504420                     | 201504448\n");
	seq_printf(file, "Nombres:           Ronald Neftali Berdúo Morales | Jefferson Linares Cerón\n");	
	seq_printf(file, "Memoria Total: %8lu MB\n", totalram);
	seq_printf(file, "Memoria Libre: %8lu MB\n", freeram);
	seq_printf(file, "Memoria Usada:     %ld%%\n",  used_percent);
  #undef K
	return 0;
}

/*
 * Metodo que reacciona al abrir el archivo del proceso
 */
static int memo_open(struct inode *inode, struct file *file) {
  return single_open(file, read_memorie, NULL);
}

/*
 * operaciones que realiza un archivo, al abrir, al leer, etc.
 */
static const struct file_operations memo_fops = {
  .owner   = THIS_MODULE,
  .open    = memo_open,
  .read    = seq_read,
  .llseek  = seq_lseek,
  .release = single_release,
};

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Ronald Berdúo - Jefferson Linares");
MODULE_DESCRIPTION("Módulo de Memoria(sysinfo)");
MODULE_VERSION("0.1.0");

/*
 * Inicio del modulo, imprime los carnets y crea el proceso
 */
static int __init memo_201504420_201504448_init(void) {
	printk(KERN_INFO "201504420 - 201504448\n");
	proc_create("memo_201504420_201504448", 0, NULL, &memo_fops);
	return 0;
}

/*
 * Salida del modulo, elimina el proceso e imprime el nombre del curso
 */
static void __exit memo_201504420_201504448_exit(void) {
	remove_proc_entry("memo_201504420_201504448", NULL);
	printk(KERN_INFO "Sistemas Operativos 1\n");
}

module_init(memo_201504420_201504448_init);
module_exit(memo_201504420_201504448_exit);