import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// FullCalendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar-scheduler.component.html',
  styleUrl: './calendar-scheduler.component.scss'
})
export class CalendarSchedulerComponent implements OnInit {
  calendarVisible = signal(true);
  events = signal<any[]>([]);
  
  newEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false
  };
  
  showModal = signal(false);
  selectedDate = signal('');
  selectedInfo: DateSelectArg | null = null;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  ngOnInit(): void {
    // Load any saved events from localStorage
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      this.events.set(JSON.parse(savedEvents));
      this.calendarOptions.events = this.events();
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedInfo = selectInfo;
    const startDate = new Date(selectInfo.startStr);
    this.selectedDate.set(startDate.toISOString().slice(0, 16));
    this.newEvent.start = selectInfo.startStr;
    this.newEvent.end = selectInfo.endStr;
    this.newEvent.allDay = selectInfo.allDay;
    this.showModal.set(true);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      this.saveEvents();
    }
  }

  handleEvents(events: EventApi[]) {
    this.events.set(events.map(e => e.toPlainObject()));
    this.saveEvents();
  }

  addEvent() {
    if (!this.newEvent.title.trim()) {
      alert('Event title is required');
      return;
    }

    const newEvents = [...this.events(), {
      title: this.newEvent.title,
      start: this.newEvent.start,
      end: this.newEvent.end,
      allDay: this.newEvent.allDay
    }];

    this.events.set(newEvents);
    this.calendarOptions.events = newEvents;
    this.saveEvents();
    this.closeModal();
  }

  closeModal() {
    this.showModal.set(false);
    this.newEvent = {
      title: '',
      start: '',
      end: '',
      allDay: false
    };
  }

  saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(this.events()));
  }
}
