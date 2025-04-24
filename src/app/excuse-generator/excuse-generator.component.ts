import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-excuse-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './excuse-generator.component.html',
  styleUrl: './excuse-generator.component.scss'
})
export class ExcuseGeneratorComponent {
  // Component state
  situation: string = '';
  excuse: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  excuseHistory: { situation: string, excuse: string }[] = [];
  geminiReady: boolean = false;
  
  // API configuration - Replace with your Gemini API key
  private apiKey: string = 'AIzaSyCn3IfUKZh2c92GArDGAKwZ2ij8MDpfaB0';
  private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  // System prompt defining the assistant's role
  private systemPrompt: string = `You are a professional Excuse Generator. 
Your job is to create creative, sometimes absurd excuses for any situation.
The excuses should be:
- Somewhat believable but with a touch of humor or absurdity
- Between 1-3 sentences long
- Appropriate for all audiences
- Creative and varied

Do not include any disclaimers, explanations, or anything other than the excuse itself.
Just generate the excuse text directly as a response.`;

  constructor(private http: HttpClient) {
    // Check if API key is set
    this.geminiReady = this.apiKey !== 'YOUR_GEMINI_API_KEY';
  }
  
  // Generate an excuse for the given situation
  generateExcuse(): void {
    if (!this.situation.trim() || !this.geminiReady) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Construct the request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            { text: this.systemPrompt },
            { text: `Generate an excuse for this situation: ${this.situation}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 100,
        topP: 0.95
      }
    };
    
    // Set up HTTP headers with API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Add API key as query parameter
    const apiUrlWithKey = `${this.apiUrl}?key=${this.apiKey}`;
    
    // Make the API request
    this.http.post(apiUrlWithKey, requestBody, { headers })
      .subscribe({
        next: (response: any) => {
          if (response && response.candidates && response.candidates[0]?.content?.parts) {
            this.excuse = response.candidates[0].content.parts[0].text.trim();
            
            // Add to history
            this.excuseHistory.unshift({
              situation: this.situation,
              excuse: this.excuse
            });
            
            // Keep only the last 5 excuses
            if (this.excuseHistory.length > 5) {
              this.excuseHistory.pop();
            }
          } else {
            this.errorMessage = 'Failed to generate an excuse. Please try again.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error generating excuse:', error);
          this.isLoading = false;
          
          if (this.apiKey === 'YOUR_GEMINI_API_KEY') {
            this.errorMessage = 'Please update the component with a valid Gemini API key.';
          } else if (error.status === 403) {
            this.errorMessage = 'API key invalid or expired. Please check your Gemini API key.';
          } else {
            this.errorMessage = 'An error occurred while generating the excuse. Please try again.';
          }
        }
      });
  }
  
  // Clear the input and generated excuse
  reset(): void {
    this.situation = '';
    this.excuse = '';
  }
}
