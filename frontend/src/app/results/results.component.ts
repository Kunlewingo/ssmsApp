import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {

  studentName: string = '';
  score: number = 0;

  results: any[] = [];

  addResult() {

    let grade = '';

    // grading system
    if (this.score >= 80) {
      grade = 'A';
    } else if (this.score >= 70) {
      grade = 'B';
    } else if (this.score >= 60) {
      grade = 'C';
    } else if (this.score >= 50) {
      grade = 'D';
    } else {
      grade = 'F';
    }

    // add result
    this.results.push({
      studentName: this.studentName,
      score: this.score,
      grade: grade
    });

    console.log(this.results);

    // clear fields
    this.studentName = '';
    this.score = 0;
  }
}