import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './add-course.component.html'
})
export class AddCourseComponent {

  courseName = '';

  courses: string[] = [];

  addCourse() {

    const existingCourses =
      JSON.parse(localStorage.getItem('courses') || '[]');

    existingCourses.push(this.courseName);

    localStorage.setItem(
      'courses',
      JSON.stringify(existingCourses)
    );

    alert('Course Added Successfully');

    this.courseName = '';
  }
}