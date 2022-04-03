
// finished by using node backend

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

type Phone struct {
	FieldValue string   `json:"fieldValue"`
	DataType   string   `json:"type"`
	Countries  []string `json:"countries"`
}

type Email struct {
	FieldValue  string `json:"fieldValue"`
	DataType    string `json:"type"`
	EmailIsFree bool   `json:"email_is_free"`
}

type Response struct {
	Emails []Email
	Phones []Phone
}

type PhonesData struct {
	PhonesData []PhoneData `json:"Phones"`
}

type PhoneData struct {
	Name     string `json:"name"`
	DialCode string `json:"dial_code"`
	Code     string `json:"code"`
}

func main() {

	var phones []PhoneData
	jsonFile, err := os.Open("phone-data.json")

	if err != nil {
		log.Fatal(err)
	}

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(byteValue, &phones)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		type Profile struct {
			Name    string
			Hobbies []string
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
		// w.Header().Set("Content-Type", "application/json")
		// w.Header().Set("Content-Type", "text/html; charset=utf-8")
		var req []map[string]interface{}
		// json.NewDecoder(r.Body).Decode(&req)
		for i, v := range req {
			fmt.Println(i, v["fieldValue"])
			for _, t := range phones {
				if strings.HasPrefix(fmt.Sprintf("%v", v["fieldValue"]), t.DialCode) {
					// if t.DialCode == v["fieldValue"] {

				}
			}
		}

		// fmt.Fprintln(w, r.Body)
		
		log.Printf("%+v", req)
		buf := new(bytes.Buffer)
		buf.ReadFrom(r.Body)
		newStr := buf.String()
		
		fmt.Println("jopa",newStr)
		fmt.Fprintln(w, newStr)
		
		// profile := Profile{"Alex", []string{"snowboarding", "programming"}}

		// js, err := json.Marshal(profile)
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }

		// w.Header().Set("Content-Type", "application/json")
		// w.Write(js)
	})

	log.Fatal(http.ListenAndServe(":8081", nil))

}
