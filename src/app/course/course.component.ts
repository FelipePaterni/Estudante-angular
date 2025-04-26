import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course',
  standalone: false,
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  formGroupCourse: FormGroup;
  allSubjects = ['Algoritmos', 'Estrutura de Dados', 'Banco de Dados'];
  selectedSubjects: string[] = [];

  constructor(
    private service: CourseService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupCourse = formBuilder.group({
      id: [''],
      name: [''],
      period: [''],
      subjects:  this.formBuilder.array([]),
    });
  }

  addSubject(event: any) {
    const subjects = this.subjectsFormArray;
    const value = event.target.value;
  
    if (event.target.checked) {
      subjects.push(this.formBuilder.control(value));
      this.selectedSubjects.push(value);
    } else {
      const index = subjects.controls.findIndex(x => x.value === value);
      subjects.removeAt(index);
  
      const selectedIndex = this.selectedSubjects.indexOf(value);
      if (selectedIndex !== -1) {
        this.selectedSubjects.splice(selectedIndex, 1);
      }
    }
  }

  get subjectsFormArray() {
    return this.formGroupCourse.get('subjects') as FormArray;
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.service.getAll().subscribe({
      next: (json) => (this.courses = json),
    });
  }

  save() {
    this.service.save(this.formGroupCourse.value).subscribe({
      next: (json) => {
        this.courses.push(json);
        this.formGroupCourse.reset();
        this.subjectsFormArray.clear(); 
        this.selectedSubjects = [];
      },
    });
  }

  delete(course: Course) {
    this.service.delete(course).subscribe({
      next: () => {
        this.courses = this.courses.filter((c) => c.id !== course.id);
      },
    });
  }
}
