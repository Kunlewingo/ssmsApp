import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-course.component.html'
})
export class ViewCourseComponent implements OnInit {

  courses: string[] = [];

  ngOnInit(): void {

    this.loadCourses();
  }

  loadCourses() {

    this.courses =
      JSON.parse(localStorage.getItem('courses') || '[]');
  }

  deleteCourse(index: number) {

    this.courses.splice(index, 1);

    localStorage.setItem(
      'courses',
      JSON.stringify(this.courses)
    );
  }
}