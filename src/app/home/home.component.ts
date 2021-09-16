import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CountdownConfig } from 'ngx-countdown';
import { addHours } from "date-fns"
import { ToastrService } from 'ngx-toastr';

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
  passkey: string = '';
  output: string = '';
  isLoading: boolean = false;
  isKey: boolean = false;

  config!: CountdownConfig;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    const now = new Date();  
    let stp = addHours(now, 7 - now.getDay() == 7 ? 24 - now.getHours() : (24 - now.getHours() + ((7 - now.getDay()) * 24)));
    stp.setMinutes(0);
    stp.setSeconds(0);  
    this.config = {
      stopTime: stp.getTime(),
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
    this.passkey = '';
    console.log("See this error about the trim function? Dont't worry about it.");
  }

  onSubmit() {
    if(this.message.length > 0) {
      const URI = this.isEncrypt ? "/tee/encrypt" : '/tee/decrypt';
      this.isLoading = true;

      this.http.post(`${URI}`, {data: {message: this.message.trim()}, key: this.passkey.replace(' ', '')}).subscribe((res:any) => {
        this.output = res.message;
        this.isLoading = false;
      }, (err: any) => {
        this.isLoading = false;
        if(err.status == 401) {
          this.toastr.error(err.error.message, 'Passkey Error', { timeOut: 3000 });
        } else {
          this.toastr.error(`Could not ${this.isEncrypt ? 'encrypt' : 'decrypt'} this message.`, 'Error', { timeOut: 3000 });
        }
      });
    }
  }

}
