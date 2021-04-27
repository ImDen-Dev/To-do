import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());

  changeMonth(dir: number): void {
    const value = this.date.value.add(dir, 'month');
    this.date.next(value);
  }

  changeDate(day: moment.Moment): void {
    const value = this.date.value.set({
      date: day.date(),
      month: day.month(),
    });
    this.date.next(value);
  }
}
