import React, { Component } from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

class Calendar extends Component {
  render() {
      const localizer = BigCalendar.momentLocalizer(moment);
      const events = [
          {
              allDay: false,
              end: new Date('November  27, 2018 16:00:00'),
              start: new Date('November 27, 2018 14:00:00'),
              title: 'hi',
          }
      ];
    return (
      <div>
          <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable={true}
          />
      </div>
    );
  }
}

export default Calendar;
