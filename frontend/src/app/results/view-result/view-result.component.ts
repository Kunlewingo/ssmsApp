import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-result.component.html'
})
export class ViewResultsComponent implements OnInit {

  results: any[] = [];

  ngOnInit(): void {

    this.loadResults();
  }

  loadResults() {

    this.results =
      JSON.parse(localStorage.getItem('results') || '[]');
  }

  deleteResult(index: number) {

    this.results.splice(index, 1);

    localStorage.setItem(
      'results',
      JSON.stringify(this.results)
    );
  }
}