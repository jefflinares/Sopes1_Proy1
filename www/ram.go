package main

import (
	"strconv"
	"strings"
)

type RAM struct {
	Total       uint64  `json:"total"`
	Used        uint64  `json:"used"`
	UsedPercent float64 `json:"usedPercent"`
	Free        uint64  `json:"free"`
	Available   uint64  `json:"available"`
	Buffers     uint64  `json:"buffers"`
	Cached      uint64  `json:"cached"`
}

// Explicacion de memoria RAM
// https://soporte.itlinux.cl/hc/es/articles/200121338-Explicaci%C3%B3n-del-uso-de-Memoria-RAM#:~:text=En%20el%20caso%20de%20Linux,como%20memoria%20cach%C3%A9%2C%20o%20buffer.&text=Lo%20cual%20nos%20indica%20que,RAM%20efectivamente%20disponibles%20para%20utilizar.
func (ram *RAM) virtualMemory() error {
	filename := "/proc/meminfo"
	lines, _ := readLines(filename)

	for _, line := range lines {
		fields := strings.Split(line, ":")
		if len(fields) != 2 {
			continue
		}
		key := strings.TrimSpace(fields[0])
		value := strings.TrimSpace(fields[1])
		value = strings.Replace(value, " kB", "", -1)

		t, err := strconv.ParseUint(value, 10, 64)
		if err != nil {
			return err
		}

		switch key {
		case "MemTotal":
			ram.Total = t / 1024
		case "MemFree":
			ram.Free = t / 1024
		case "Buffers":
			ram.Buffers = t / 1024
		case "Cached":
			ram.Cached = t / 1024
		}
	}

	ram.Available = ram.Free + ram.Buffers + ram.Cached
	ram.Used = ram.Total - ram.Available
	ram.UsedPercent = (float64(ram.Total-ram.Available) / float64(ram.Total)) * 100.0

	return nil
}

func getTotalRAM() (uint64, error) {
	filename := "/proc/meminfo"
	lines, _ := readLines(filename)

	var total uint64 = 0

	for _, line := range lines {
		fields := strings.Split(line, ":")
		if len(fields) != 2 {
			continue
		}
		key := strings.TrimSpace(fields[0])
		value := strings.TrimSpace(fields[1])
		value = strings.Replace(value, " kB", "", -1)

		t, err := strconv.ParseUint(value, 10, 64)
		if err != nil {
			return total, err
		}

		switch key {
		case "MemTotal":
			total = t / 1024
			return total, nil
		}
	}
	return total, nil
}
