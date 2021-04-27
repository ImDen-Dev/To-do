import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task, TasksService } from '../shared/tasks.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css'],
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[];
  isEdit = false;
  id: string;

  constructor(
    public dateService: DateService,
    private taskService: TasksService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });

    this.dateService.date
      .pipe(switchMap((value) => this.taskService.load(value)))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }

  submit(): void {
    const { title } = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };
    if (!this.isEdit) {
      this.taskService.create(task).subscribe(
        (tasks) => {
          this.tasks.push(tasks);
          this.form.reset();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.taskService.edit(task, this.id).subscribe(
        (t) => {
          this.tasks = this.tasks.map((value) => {
            return value.id === this.id ? { ...value, title: t.title } : value;
          });
          this.form.reset();
          this.isEdit = false;
          this.id = '';
        },
        (error) => console.log(error)
      );
    }
  }

  delete(task: Task): void {
    this.taskService.delete(task).subscribe(
      () => {
        this.tasks = this.tasks.filter((t) => task.id !== t.id);
      },
      (error) => console.log(error)
    );
  }

  edit(task: Task): void {
    this.isEdit = true;
    this.form.setValue({ title: task.title });
    this.id = task.id;
  }
}
