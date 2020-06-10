package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type Proc struct {
	Pid    string  `json:"Pid,omitempty"`
	Name   string  `json:"Name,omitempty"`
	User   string  `json:"User,omitempty"`
	Status string  `json:"Status,omitempty"`
	Memory string  `json:"Memory,omitempty"`
	PPid   string  `json:"PPid,omitempty"`
	Hijos  []*Proc `json:"Hijos,omitempty"`
}

type ProcsInfo struct {
	No_Procs     int     `json:"No_Procs"`
	No_Procs_Run int     `json:"NoR_Procs_un"`
	No_Procs_Slp int     `json:"No_Procs_Slp"`
	No_Procs_Stp int     `json:"No_Procs_Stp"`
	No_Procs_Zmb int     `json:"No_Procs_Zmb"`
	Processes    []*Proc `json:"Processes,omitempty"`
}

func getInfoProcs() *ProcsInfo {
	files, err := ioutil.ReadDir("/proc")
	if err != nil {
		log.Fatal(err)
	}
	procs := []*Proc{}
	No_Procs_Sleeping := 0
	No_Procs_Stopped := 0
	No_Procs_Zombies := 0
	No_Procs_Running := 0
	for _, f := range files {
		if f.IsDir() {
			v := f.Name()
			//fmt.Println("directorio: ", v)
			p := new(Proc)
			if s, err := strconv.Atoi(v); err == nil {
				filename := "/proc/" + v + "/status"
				lines, _ := readLines(filename)
				for _, line := range lines {

					fields := strings.Split(line, ":")
					key := strings.TrimSpace(fields[0])
					switch key {
					case "Uid":
						user_ids := strings.Split(fields[1], "\t")

						if len(user_ids) > 0 {
							user_id, err := strconv.ParseUint(user_ids[1], 10, 64)
							if err != nil {
								log.Fatal(err)
							} else {
								user_id := strings.TrimSpace(fmt.Sprintf("%8d", user_id))
								cmd := exec.Command("id", "-nu", user_id)
								cmdOutput := &bytes.Buffer{}
								cmd.Stdout = cmdOutput
								err := cmd.Run()
								if err != nil {
									os.Stderr.WriteString(err.Error())
								}
								p.User = strings.Replace(string(cmdOutput.Bytes()), "\n", "", -1)

							}
						}

					}

					switch key {
					case "Name":

						p.Name = strings.TrimSpace(fields[1])
						break
					case "Pid":
						p.Pid = strings.TrimSpace(fields[1])
						break
					case "State":
						p.Status = strings.TrimSpace(fields[1])
						if strings.HasPrefix(p.Status, "S") || strings.HasPrefix(p.Status, "D") {
							No_Procs_Sleeping++
						} else if strings.HasPrefix(p.Status, "T") {
							No_Procs_Stopped++
						} else if strings.HasPrefix(p.Status, "Z") {
							No_Procs_Zombies++
						} else if strings.HasPrefix(p.Status, "R") {
							No_Procs_Running++
						} else {
							//fmt.Println("No se reconocio el estado", p.Status)
						}
						break
					case "PPid":
						p.PPid = strings.TrimSpace(fields[1])
						//fmt.Println("PPId:", p.PPid, "PId:", p.Pid)
						break
					case "VmSize":
						value := strings.TrimSpace(strings.Replace(fields[1], "kB", "", -1))
						//fmt.Println("Memoria_V :", value)
						t, err := strconv.ParseUint(value, 10, 64)
						if err != nil {
							log.Fatal(err)
						}
						mem, err := getTotalRAM()
						if err != nil {
							log.Fatal(err)
						}
						mem = mem / ((t * 1000) / 1024 / 1024)
						p.Memory = fmt.Sprintf("%8d", t)
						break

					}

				}

				procs = append(procs, p)

			} else {
				fmt.Println("el directorio no empieza con numeros: ", s)
				continue
			}

		} else {
			fmt.Println("no es directorio", f.Name())
		}

	}

	//agregar los hijos a cada proceso

	procs_padre := []*Proc{}

	for _, p := range procs {
		//fmt.Println("agregar hijo a:", p.PPid, " IdHijo:", p.Pid)
		if strings.Compare(p.PPid, "0") == 0 {
			procs_padre = append(procs_padre, p)
		} else {
			addHijo(procs, p)
		}
	}

	fmt.Println("Procesos recogidos total:", len(procs))
	fmt.Println("Procesos padres total:", len(procs_padre))

	for _, p := range procs_padre {
		seeTreeProcess(p, "---")
	}

	return &ProcsInfo{No_Procs: len(procs), No_Procs_Run: No_Procs_Running,
		No_Procs_Slp: No_Procs_Sleeping, No_Procs_Stp: No_Procs_Stopped,
		No_Procs_Zmb: No_Procs_Zombies, Processes: procs_padre}

	//fmt.Println(json_bytes)

	/*
		return ProcsInfo{No_Procs: len(procs), No_Procs_Run: No_Procs_Running,
			No_Procs_Slp: No_Procs_Sleeping, No_Procs_Stp: No_Procs_Stopped,
			No_Procs_Zmb: No_Procs_Zombies, Processes: procs_padre}
	*/
}

func seeTreeProcess(proc *Proc, tab string) {
	fmt.Println(tab, "Proccess: ", proc.Name)
	if len(proc.Hijos) > 0 {
		for _, H := range proc.Hijos {
			seeTreeProcess(H, tab+"---")
		}
	}

}

func addHijo(procs []*Proc, child_proc *Proc) {
	for i := 0; i < len(procs); i++ {
		p := procs[i]
		if strings.Compare(p.Pid, child_proc.PPid) == 0 {

			//fmt.Println("Se agrego al proceso padre:", p.Name, "|id:", p.Pid, "  El hijo ", child_proc.Name, "|id:", child_proc.Pid, "|ppid:", child_proc.PPid)
			p.Hijos = append(p.Hijos, child_proc)

			//fmt.Println("Numero hijos: ", len(p.Hijos))
		}
	}
}
