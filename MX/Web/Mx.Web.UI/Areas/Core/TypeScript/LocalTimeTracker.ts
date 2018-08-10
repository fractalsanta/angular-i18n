module Core {
    "use strict";

    export class LocalTimeTracker {
        difference: Duration;

        constructor(localTime: Moment) {
            this.difference = moment.duration(moment().diff(localTime));
        }

        public Get(): Moment {
            return moment().add(-this.difference);
        }
    }
}
