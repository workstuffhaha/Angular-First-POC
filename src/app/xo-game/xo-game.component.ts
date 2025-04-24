import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-xo-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xo-game.component.html',
  styleUrl: './xo-game.component.scss'
})
export class XoGameComponent {
  // Game state
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer: string = 'X';
  winner: string | null = null;
  isDraw: boolean = false;
  scores = {
    X: 0,
    O: 0,
    draw: 0
  };

  // Make a move in the game
  makeMove(row: number, col: number): void {
    // If cell is already filled or game is over, return
    if (this.board[row][col] || this.winner || this.isDraw) {
      return;
    }

    // Set the cell with current player
    this.board[row][col] = this.currentPlayer;

    // Check for winner or draw
    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      this.scores[this.currentPlayer as keyof typeof this.scores]++;
    } else if (this.checkDraw()) {
      this.isDraw = true;
      this.scores.draw++;
    } else {
      // Switch player
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  // Check if there's a winner
  checkWinner(): boolean {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][0] === this.board[i][2]
      ) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] &&
        this.board[0][i] === this.board[1][i] &&
        this.board[0][i] === this.board[2][i]
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      this.board[0][0] &&
      this.board[0][0] === this.board[1][1] &&
      this.board[0][0] === this.board[2][2]
    ) {
      return true;
    }

    if (
      this.board[0][2] &&
      this.board[0][2] === this.board[1][1] &&
      this.board[0][2] === this.board[2][0]
    ) {
      return true;
    }

    return false;
  }

  // Check if the game is a draw
  checkDraw(): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) {
          return false; // If any cell is empty, game is not a draw
        }
      }
    }
    return true; // All cells are filled, game is a draw
  }

  // Reset the game
  resetGame(): void {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
  }
}
