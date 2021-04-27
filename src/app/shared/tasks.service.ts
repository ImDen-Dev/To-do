import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateRespoonse {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  static URL =
    'https://angular-practice-calenda-78d5f-default-rtdb.europe-west1.firebasedatabase.app/tasks';

  constructor(private http: HttpClient) {}

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.URL}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks) => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map((key) => ({ ...tasks[key], id: key }));
        })
      );
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateRespoonse>(`${TasksService.URL}/${task.date}.json`, task)
      .pipe(
        map((res) => {
          return { ...task, id: res.name };
        })
      );
  }

  delete(task: Task): Observable<void> {
    return this.http.delete<void>(
      `${TasksService.URL}/${task.date}/${task.id}.json`
    );
  }

  edit(task: Task, id: string): Observable<any> {
    return this.http.patch(`${TasksService.URL}/${task.date}/${id}.json`, task);
  }
}
