import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  description: string;
  completed: boolean;
  editing: boolean;
  editText: string;
}

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements AfterViewChecked {
  tasks: Task[] = [];
  newTask: string = '';
  filter: FilterType = 'all';
  filteredTasks: Task[] = [];
  nextId: number = 1;
  
  @ViewChild('editInput') editInput?: ElementRef;
  focusEditInput: boolean = false;
  
  constructor() {
    // Initialize with some sample tasks
    this.tasks = [
      { id: this.nextId++, description: 'Learn Angular', completed: false, editing: false, editText: '' },
      { id: this.nextId++, description: 'Build a Todo App', completed: false, editing: false, editText: '' },
      { id: this.nextId++, description: 'Master TypeScript', completed: false, editing: false, editText: '' }
    ];
    this.applyFilter();
  }
  
  ngAfterViewChecked() {
    // Focus the edit input when needed
    if (this.focusEditInput && this.editInput) {
      this.editInput.nativeElement.focus();
      this.focusEditInput = false;
    }
  }
  
  // Add a new task
  addTask(): void {
    if (this.newTask.trim()) {
      const task: Task = {
        id: this.nextId++,
        description: this.newTask.trim(),
        completed: false,
        editing: false,
        editText: ''
      };
      
      this.tasks.push(task);
      this.newTask = '';
      this.applyFilter();
    }
  }
  
  // Delete a task
  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.applyFilter();
  }
  
  // Toggle task completion status
  toggleTaskStatus(task: Task): void {
    task.completed = !task.completed;
    this.applyFilter();
  }
  
  // Enter edit mode for a task
  editTask(task: Task, editInput?: ElementRef): void {
    // Exit edit mode for any other tasks
    this.tasks.forEach(t => {
      if (t.id !== task.id) {
        t.editing = false;
      }
    });
    
    task.editing = true;
    task.editText = task.description;
    this.focusEditInput = true;
  }
  
  // Update task after editing
  updateTask(task: Task): void {
    if (task.editText.trim()) {
      task.description = task.editText.trim();
    }
    task.editing = false;
    this.applyFilter();
  }
  
  // Set the current filter
  setFilter(filter: FilterType): void {
    this.filter = filter;
    this.applyFilter();
  }
  
  // Apply the current filter
  applyFilter(): void {
    switch (this.filter) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      default:
        this.filteredTasks = [...this.tasks];
        break;
    }
  }
  
  // Get count of active tasks
  getActiveTaskCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
  
  // Get count of completed tasks
  getCompletedTaskCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }
  
  // Clear all completed tasks
  clearCompleted(): void {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.applyFilter();
  }
}
