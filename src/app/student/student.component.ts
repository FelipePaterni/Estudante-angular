import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  formGroupStudent: FormGroup;
  isEditing: boolean = false;

  constructor(
    private service: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupStudent = formBuilder.group({
      id: [''],
      name: [''],
      course: [''],
    });
  }

  ngOnInit(): void {
    this.loadStudent();
  }

  loadStudent() {
    this.service.getAll().subscribe({
      next: (json) => (this.students = json),
    });
  }

  OnClicksave() {
    this.service.save(this.formGroupStudent.value).subscribe({
      next: (json) => {
        this.students.push(json);
        this.formGroupStudent.reset();
      },
    });
  }
  OnClickDelete(student: Student) {
    this.service.delete(student.id).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s.id !== student.id);
      },
    });
  }
  OnClickUpdate(student: Student) {
    this.formGroupStudent.setValue(student);
    this.isEditing = true;
  }
  OnClickConfirmUpdate() {
    this.service.update(this.formGroupStudent.value).subscribe({
      next: () => {
        this.loadStudent();
      this.clear();
      },
    });
  }
  onClickClear() {
    this.clear();
  }
  clear() {
    this.isEditing = false;
    this.formGroupStudent.reset();
  }
}
