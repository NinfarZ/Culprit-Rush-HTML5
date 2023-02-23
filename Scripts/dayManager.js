//manages the contents of each day in the game

const dayDisplay = document.querySelector(".display__time--day");
const hoursDisplay = document.querySelector(".display__time--hours");
const periodDisplay = document.querySelector(".display__time--period");

export let dayManager = {
    currentDay: 1,
    currentHour: 7,
    currentMinutes: 0,
    currentPeriod: "Morning",
    timePeriod: "am",

    passTheTime: function () {

        this.currentMinutes += 30

        if (this.currentMinutes === 60) {
            this.currentMinutes = 0
            this.currentHour += 1
        }

        if (this.currentHour === 12 && this.currentMinutes === 0) {
            if (this.timePeriod === "am") {
                this.timePeriod = "pm"
            } else {
                this.currentDay += 1;
                this.timePeriod = "am"
            }
        }

        if (this.currentHour > 12) this.currentHour = 1

        updateTimeDisplay(this.currentDay, this.getTime(), this.getPeriod());
    },
    getTime: function () {
        return `${this.currentHour}:${this.currentMinutes === 0 ? "00" : this.currentMinutes} ${this.timePeriod}`
    },
    getTimeLie: function () {
        const hoursLie = this.currentHour !== 1 ? this.currentHour - 1 : this.currentHour;
        return `${hoursLie}:${this.currentMinutes === 0 ? "00" : this.currentMinutes} ${this.timePeriod}`;
    },
    canDisplayTime() {
        if (["10:00 am", "12:00 pm", "10:00 pm"].includes(this.getTime())) return true;
        return false;
    },
    skipToMorning() {
        this.currentHour = 7
        this.currentMinutes = 0
    },
    getPeriod() {
        switch (this.getTime()) {
            case "7:30 am":
                this.currentPeriod = "Morning";
                return "Morning";
            case "12:00 pm":
                this.currentPeriod = "Afternoon";
                return "Afternoon";
            case "8:00 pm":
                this.currentPeriod = "Night";
                return "Night";
            default:
                break;
        }
    },
    "10:00 am": {
        text: function () {
            return [`[Morning] [Day ${dayManager.currentDay}] [${dayManager.getTime()}]`];
        }
    },
    "12:00 pm": {
        text: function () {
            return [`[Afternoon: Day ${dayManager.currentDay}: ${dayManager.getTime()}]`];
        }
    },
    "10:00 pm": {
        text: function () {
            return [`[Night: Day ${dayManager.currentDay}: ${dayManager.getTime()}]`];
        }
    },
    "12:00 am": {
        text: function () {
            return [`It's ${dayManager.getTime()}. You went back to your room and slept for the night.`];
        }
    }

}

function updateTimeDisplay(day, hours, period) {
    dayDisplay.innerHTML = "Day " + day;
    hoursDisplay.innerHTML = hours;
    if (period) periodDisplay.innerHTML = period;
}