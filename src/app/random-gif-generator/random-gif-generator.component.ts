import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-random-gif-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './random-gif-generator.component.html',
  styleUrl: './random-gif-generator.component.scss'
})
export class RandomGifGeneratorComponent {
  // Component state
  searchTerm: string = '';
  gifUrl: string = '';
  gifTitle: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  searchTermEntered: boolean = false;
  searchHistory: string[] = [];
  
  // API configuration - Replace 'YOUR_API_KEY' with your actual Giphy API key
  private apiKey: string = 'J3x65OJVdlmiM2Y8keUHpBCJwZq9rRBP';
  private giphyApiUrl: string = 'https://api.giphy.com/v1/gifs/random';
  
  constructor(private http: HttpClient) {}
  
  // Get a random GIF based on the search term
  getRandomGif(): void {
    if (!this.searchTerm.trim()) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.searchTermEntered = true;
    
    // Add the search term to history (if not already present)
    if (!this.searchHistory.includes(this.searchTerm)) {
      // Keep only the last 5 searches
      if (this.searchHistory.length >= 5) {
        this.searchHistory.pop();
      }
      this.searchHistory.unshift(this.searchTerm);
    }
    
    // Construct the API URL with query parameters
    const params = {
      api_key: this.apiKey,
      tag: this.searchTerm,
      rating: 'g' // G-rated content for safety
    };
    
    this.http.get(this.giphyApiUrl, { params })
      .subscribe({
        next: (response: any) => {
          if (response.data && response.data.images) {
            this.gifUrl = response.data.images.downsized.url;
            this.gifTitle = response.data.title;
          } else {
            this.gifUrl = '';
            this.gifTitle = '';
            this.errorMessage = 'No GIF found for this search term.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching GIF:', error);
          this.isLoading = false;
          this.gifUrl = '';
          this.gifTitle = '';
          
          if (this.apiKey === 'YOUR_API_KEY') {
            this.errorMessage = 'Please update the component with a valid Giphy API key.';
          } else if (error.status === 403) {
            this.errorMessage = 'API key invalid or expired. Please check your Giphy API key.';
          } else {
            this.errorMessage = 'An error occurred while fetching the GIF. Please try again.';
          }
        }
      });
  }
  
  // Set search term from history
  setSearchTerm(term: string): void {
    this.searchTerm = term;
    this.getRandomGif();
  }
}
