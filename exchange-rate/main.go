package main

import (
	"bufio"
	"bytes"
	"encoding/csv"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

type inputGoal struct {
	// from currency.Unit
	// to currency.Unit
	from string
	to string
	amount uint64
}
func (g inputGoal) String() string {
	// return fmt.Sprintf("convert %v %v into %v", g.amount, g.from, g.to)
	return fmt.Sprintf("%v;%v;%v", g.from, g.amount, g.to)
}

const precision = 4
type rate struct {
	uint64
}
func newRate(i uint64, d uint64) rate {
	// ld := int(math.Ceil(math.Log10(float64(d))))
	ld := 4
	return rate{uint64(math.Pow10(precision))*i+uint64(math.Pow10(precision-ld))*d}
}
func (r rate) toFloat() float64 {
	return float64(r.uint64)/float64(uint64(math.Pow10(precision)))
}
func (r rate) String() string {
	return fmt.Sprintf("%v", r.toFloat())
}
func (r *rate) inverse() rate {
	return rate{uint64(math.Round(1/r.toFloat()*math.Pow10(precision)))}
}

type inputExchangeRate struct {
	// from currency.Unit
	// to currency.Unit
	from string
	to string
	rate rate
}
func (e inputExchangeRate) String() string {
	// return fmt.Sprintf("%v -> %v (%v)", e.from, e.to, e.rate)
	return fmt.Sprintf("%v;%v;%v", e.from, e.to, e.rate)
}

type input struct {
	inputGoal
	rates []inputExchangeRate
}
func (i input) String() string {
	s := fmt.Sprintf("%v\n%v\n", i.inputGoal, len(i.rates))
	for n, r := range i.rates {
		s+=fmt.Sprintf("%v", r)
		if n != len(i.rates)-1 {
			s+="\n"
		}
	}
	return s
}

func main() {
	if len(os.Args) != 2 {
		log.Fatal("requires a unique argument: input file path")
	}
	filepath := os.Args[1]
	file, err := os.OpenFile(filepath, os.O_RDONLY, os.ModeExclusive);
	if err != nil {
		log.Fatal(err)
	}
	scanner := bufio.NewScanner(file);

	readGoal := inputGoal{}
	rateCount := uint64(0)
	rates := []inputExchangeRate{}

	linesRead := 0
	for scanner.Scan() {
		if linesRead == 0 {
			reader := csv.NewReader(bytes.NewReader(scanner.Bytes()))
			reader.Comma = ';'
			records, err := reader.ReadAll()
			if err != nil {
				log.Fatal(err)
			}
			if len(records) != 1 {
				log.Fatal("unable to parse goal from input")
			}
			// from, err := currency.ParseISO(records[0][0])
			// if err != nil {
			// 	fmt.Println(records[0][0])
			// 	log.Fatal(err)
			// }
			from := records[0][0]
			amount, err := strconv.ParseUint(records[0][1],10,64)
			if err != nil {
				log.Fatal(err)
			}
			// to, err := currency.ParseISO(records[0][2])
			// if err != nil {
			// 	fmt.Println(records[0][1])
			// 	log.Fatal(err)
			// }
			to := records[0][2]
			readGoal = inputGoal{from: from, to: to, amount: amount}
		} else if (linesRead == 1) {
			rc, err := strconv.ParseUint(scanner.Text(), 10, 64)
			if err != nil {
				log.Fatal(err)
			}
			rateCount = rc
		} else {
			reader := csv.NewReader(bytes.NewReader(scanner.Bytes()))
			reader.Comma = ';'
			records, err := reader.ReadAll()
			if err != nil {
				log.Fatal(err)
			}
			if len(records) != 1 {
				log.Fatal("unable to parse exchange rate entry from input")
			}
			// from, err := currency.ParseISO(records[0][0])
			// if err != nil {
			// 	fmt.Println(records[0][0])
			// 	log.Fatal(err)
			// }
			from := records[0][0]
			// to, err := currency.ParseISO(records[0][1])
			// if err != nil {
			// 	fmt.Println(records[0][1])
			// 	log.Fatal(err)
			// }
			to := records[0][1]
			splitRate := strings.Split(records[0][2], ".")
			if len(splitRate) > 2 {
				fmt.Println(records[0][2])
				log.Fatal("unable to parse exchange rate")
			}
			intRate, err := strconv.ParseUint(splitRate[0],10,64)
			if err != nil {
				log.Fatal(err)
			}
			decRate := uint64(0)
			if len(splitRate) == 2 {
				dr, err := strconv.ParseUint(splitRate[1],10,64)
				if err != nil {
					log.Fatal(err)
				}
				decRate = dr
			}
			rate := newRate(intRate, decRate)
			// fmt.Fprintf(os.Stderr, "%v -> %v\n", records[0][2], rate)
			rates = append(rates, inputExchangeRate{ from: from, to: to, rate: rate })
		}
		linesRead++
	}
	if err:=scanner.Err(); err !=nil {
		log.Fatal(err)
	}
	if err:=file.Close(); err!= nil {
		log.Fatal(err)
	}

	if len(rates) != int(rateCount) {
		log.Fatal("error: the number over exchange rates does not match the second line of the input")
	}

	input := input{inputGoal: readGoal, rates: rates}
	// fmt.Fprintln(os.Stderr, "input")
	// fmt.Fprintln(os.Stderr, input)
	// fmt.Fprintln(os.Stderr)

	state := newState(&input)
	state.explore()
	
	state.printPath(&readGoal)
}

type path struct {
	// next currency.Unit
	next string
	length uint64
	rate float64
}
type state struct {
	// directPaths map[currency.Unit]map[currency.Unit]rate
	// nextTowards map[currency.Unit]map[currency.Unit]path
	directPaths map[string]map[string]rate
	nextTowards map[string]map[string]path
}
func newState(i *input) *state {
	directPaths := map[string]map[string]rate{}
	nextTowards := map[string]map[string]path{}

	for _, r := range i.rates {
		if _, ok := directPaths[r.from]; !ok {
			directPaths[r.from] = map[string]rate{}
			directPaths[r.from][r.from] = newRate(1,0)
		}
		directPaths[r.from][r.to] = r.rate
		if _, ok := directPaths[r.to]; !ok {
			directPaths[r.to] = map[string]rate{}
			directPaths[r.to][r.to] = newRate(1,0)
		}
		directPaths[r.to][r.from] = r.rate.inverse()

		if _, ok := nextTowards[r.from]; !ok {
			nextTowards[r.from] = map[string]path{}
			nextTowards[r.from][r.from] = path{next: r.from, length: 0, rate: 1}
		}
		nextTowards[r.from][r.to] = path{next: r.to, length: 1, rate: r.rate.toFloat()}
		if _, ok := nextTowards[r.to]; !ok {
			nextTowards[r.to] = map[string]path{}
			nextTowards[r.to][r.to] = path{next: r.to, length: 0, rate: 1}
		}
		nextTowards[r.to][r.from] = path{next: r.from, length: 1, rate: r.rate.inverse().toFloat()}
	}
	return &state{directPaths: directPaths, nextTowards: nextTowards}
}
func (s *state) explore() {
	for s.exploreNext() {}
}
func (s *state) exploreNext() bool {
	foundNew := false
	for u := range s.directPaths {
		for d, pd := range s.nextTowards[u] {
			l := pd.length+1
			for f, rf := range s.directPaths[d] {
				pfr := pd.rate*rf.toFloat()
				if pf, ok := s.nextTowards[u][f]; ok {
					if pf.length < l {
						continue
					}
					if pf.rate <= pfr {
						continue
					}
				}
				s.nextTowards[u][f] = path{next: pd.next, length: l, rate: pfr}
				foundNew = true
			}
		}
	}
	return foundNew
}
func (s *state) printPath(g *inputGoal) {
	if _, ok := s.nextTowards[g.from][g.to]; !ok {
		log.Fatalf("no path for goal %v\n", g)
	}
	p := s.nextTowards[g.from][g.to]
	fmt.Fprintf(os.Stderr, "path for goal %v:\nlength %v, rate %v\n%v %v -> %v %v\n", g, p.length, p.rate, g.amount, g.from, float64(g.amount)*p.rate, g.to)
	v := float64(g.amount)
	for c := g.from; c != g.to; c = s.nextTowards[c][g.to].next {
		n := s.nextTowards[c][g.to].next
		r := s.directPaths[c][n]
		nv := v*r.toFloat()
		fmt.Fprintf(os.Stderr, "[%v->%v (%v)]\t", c, n, r)
		fmt.Fprintf(os.Stderr, "%v %v -> %v %v\n", v, c, nv, n)
		v = nv
	}
	fmt.Println(uint64(math.Round(float64(g.amount)*p.rate)))
}
