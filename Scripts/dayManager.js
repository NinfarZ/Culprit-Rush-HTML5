//manages the contents of each day in the game

export let dayManager = {
    currentDay: 1,
    currentHour: 10,
    currentMinutes: 0,
    timePeriod: "am",
    passTheTime: function () {
        this.currentMinutes += 30
        if (this.currentMinutes === 60) {
            this.currentMinutes = 0
            this.currentHour += 1
        }
        if (this.currentHour === 12 && this.currentMinutes === 0) {
            this.timePeriod === "am" ? this.timePeriod = "pm" : this.timePeriod = "am"
        }
        if (this.currentHour > 12) this.currentHour = 1
    },
    getTime: function () {
        return `${this.currentHour}:${this.currentMinutes === 0 ? "00" : this.currentMinutes} ${this.timePeriod}`
    },
    canDisplayTime() {
        if (["10:00 am", "12:00 pm", "10:00 pm"].includes(this.getTime())) return true;
        return false;
    },
    "10:00 am": {
        text: function () {
            return `[Morning] [Day ${dayManager.currentDay}] [${dayManager.getTime()}]`
        }
    },
    "12:00 pm": {
        text: function () {
            return `[Afternoon: Day ${dayManager.currentDay}: ${dayManager.getTime()}]`
        }
    },
    "10:00 pm": {
        text: function () {
            return `[Night: Day ${dayManager.currentDay}: ${dayManager.getTime()}]`
        }
    }
}