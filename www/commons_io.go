package main

import (
	"bufio"
	"os"
	"strings"
)

// ReadLines lee el contenido del archivo y los divide por una nueva línea.
// ReadLinesOffsetN(filename, 0, -1).
func readLines(filename string) ([]string, error) {
	return readLinesOffsetN(filename, 0, -1)
}

// ReadLines lee el contenido del archivo y los divide por una nueva línea.
// Offset, indica en qué número de línea comenzar.
// El contador determina el número de líneas para leer (comenzando desde el desplazamiento):
//   n >= 0: a lo sumo n líneas
//   n < 0: archivo completo
func readLinesOffsetN(filename string, offset uint, n int) ([]string, error) {
	f, err := os.Open(filename)

	if err != nil {
		return []string{""}, err
	}

	defer f.Close()

	var ret []string

	r := bufio.NewReader(f)
	for i := 0; i < n+int(offset) || n < 0; i++ {
		line, err := r.ReadString('\n')
		if err != nil {
			break
		}
		if i < int(offset) {
			continue
		}
		ret = append(ret, strings.Trim(line, "\n"))
	}

	return ret, nil
}
