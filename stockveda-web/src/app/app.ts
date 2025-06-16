import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected title = 'stockveda-web';
  question = '';
  answer = '';
  sources: string[] = [];
  loading = false;

  constructor(private http: HttpClient) { }

  askQuestion() {
    if (!this.question.trim()) {
      return;
    }

    this.loading = true;
    this.answer = '';
    this.sources = [];

    this.http.post<any>('http://127.0.0.1:8000/ask', {
      question: this.question
    }).subscribe({
      next: (response) => {
        this.answer = response.answer;
        this.sources = response.sources || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.answer = 'An error occurred while processing your request.';
        this.loading = false;
      }
    })
  }

}
