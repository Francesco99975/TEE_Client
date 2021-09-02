import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CountdownConfig } from 'ngx-countdown';
import { addDays } from "date-fns"

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isEncrypt: boolean = true;
  message: string = '';
  output: string = '';
  isLoading: boolean = false;

  config!: CountdownConfig;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const now = new Date();
    now.setHours(23);
    now.setMinutes(59);
    now.setSeconds(59);    
    this.config = {
      stopTime: addDays(now, 7 - now.getDay()).getTime(),
      formatDate: ({ date, formatStr }) => {
        let duration = Number(date || 0);
  
        return CountdownTimeUnits.reduce((current, [name, unit]) => {
          if (current.indexOf(name) !== -1) {
            const v = Math.floor(duration / unit);
            duration -= v * unit;
            return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
              return v.toString().padStart(match.length, '0');
            });
          }
          return current;
        }, formatStr);
      }
    };
  }

  onReset() {
    this.isEncrypt = !this.isEncrypt;
    this.message = '';
    this.output = '';
    console.log("See this error about the trim function? Dont't worry about it.");
  }

  onSubmit() {
    if(this.message.length > 0) {
      const URI = this.isEncrypt ? "/tee/encrypt" : '/tee/decrypt';
      this.isLoading = true;

      this.http.post(`${URI}`, {data: this.message}).subscribe((res:any) => {
        this.output = res.data;
        this.isLoading = false;
      });
    }
  }

}
