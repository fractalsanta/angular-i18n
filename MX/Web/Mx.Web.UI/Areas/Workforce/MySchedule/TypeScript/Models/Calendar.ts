module Workforce.MySchedule {

    export class Calendar {

        public Events: Array<Event>;

        constructor(
            events?: Array<Event>
        ) {
            if (events && events.length) {
                this.Events = events;
            } else {
                this.Events = new Array<Event>();
            }
        }
    }

    export class Event {

        public Name: string;
        public Description: string;
        public StartTime: Moment;
        public EndTime: Moment;

        constructor(
            name: string,
            description: string,
            startTime: Moment,
            endTime: Moment
        ) {
            this.Name = name;
            this.Description = description;
            this.StartTime = startTime;
            this.EndTime = endTime;
        }
    }
}