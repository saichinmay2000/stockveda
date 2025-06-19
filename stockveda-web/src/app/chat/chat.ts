import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../envirnoments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})

export class Chat implements OnInit {
  protected title = 'stockveda-web';
  question = '';
  answer = '';
  loading = false;
  hasUserAsked = false;
  companyChips: string[] = ['TCS', 'Infosys', 'HDFC Bank', 'Reliance', 'Zomato', 'ICICI', 'Adani', 'IRCTC'];
  history: { question: string, text: string, isUser: boolean, sources?: string[] }[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.history.push({
      question: '',
      text: '👋 Hi, I\'m Stock Veda! Ask me anything about stocks, mutual funds, or the financial markets.',
      isUser: false
    });
  }

  askQuestion() {
    const trimmed = this.question.trim();
    if (!trimmed) return;

    this.hasUserAsked = true;

    this.history.push({ question: trimmed, text: trimmed, isUser: true });
    this.loading = true;
    this.answer = '';

    this.http.post<any>(`${environment.API_URL}/ask`, { question: trimmed }).subscribe({
      next: (response) => {
        this.answer = response.answer;
        this.history.push({
          question: trimmed,
          text: response.answer,
          isUser: false,
          sources: response.sources || []
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.history.push({
          question: trimmed,
          text: 'An error occurred while processing your request.',
          isUser: false
        });
        this.loading = false;
      }
    });

    this.question = '';
  }

  loadHistory(msg: { question: string, text: string, isUser: boolean }) {
    this.question = msg.question;
    this.answer = msg.text;
  }
}