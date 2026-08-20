import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResultService } from '../../services/result.service';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-view-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.css']
})
export class ViewResultsComponent implements OnInit {

  results: any[] = [];
  loadError = '';

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    this.resultService.getResults().subscribe({
      next: (data) => this.results = data,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load results. Please refresh.')
    });
  }

  deleteResult(id: string) {
    if (!confirm('Delete this result?')) return;
    this.resultService.deleteResult(id).subscribe({
      next: () => this.loadResults(),
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t delete this result. Please try again.')
    });
  }
}
