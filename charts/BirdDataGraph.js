class BirdDataGraph {
    constructor(ctx, data, turbineData) {
        this.graphFormatFuncs = ['showBirdsPerTurbine', 'showBirdsPerHour', 'showBirdsPerSpeed', 'showMonth', 'showLastDay'];
        this.currentFormatNr = 0;
        this.ctx = ctx;
        this.data = data;
        this.turbineData = turbineData;
        this.type = 'bar';
        this.labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
        this.datasets = [];
        this.chart = new Chart(this.ctx, {
            type: this.type,
            data: {
                labels: this.labels,
                datasets: this.datasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                animation: false
            }
        });
        this.month = {};
        this.day = {};
        // this.render
    }
    render() {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets = this.datasets;
        this.chart.update();
    }
    setData(data) {
        this.data = data;
    }
    setTurbineData(turbineData) {
        this.turbineData = turbineData;
    }
    show(formatNr) {
        if (formatNr !== undefined) this.currentFormatNr = formatNr;
        this[this.graphFormatFuncs[this.currentFormatNr]]();
    }
    showBirdsPerTurbine() {
        let label = 'Totalt antall fugleminutter pr vindmølle';
        let turbine_ids = [];
        let turbineNames = [];
        let turbine_obs = [];
        for (let i = 0; i < this.turbineData.length; i++) {
            turbine_ids.push(this.turbineData[i].id);
            turbineNames.push(this.turbineData[i].name);
            turbine_obs.push(0);
        }
        let turbineColors = ['red', 'blue', 'yellow', 'green'];
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < turbine_ids.length; j++) {
                if (this.data[i].turbine_id == turbine_ids[j]) turbine_obs[j] += Number(this.data[i].birdminutes);
            }
        }
        this.datasets = [{
            label,
            data: turbine_obs,
            borderWidth: 1,
            backgroundColor: turbineColors
        }];
        this.labels = turbineNames;
        this.render();
    }
    showBirdsPerHour() {
        let label = 'Totalt antall fugleminutter pr tidpunkt på døgnet';
        let hours = [];
        let hoursLabel = [];
        let hoursColor = [];
        let resolution = this.birdsPerHourResolution;
        if (!resolution) return console.log('Ugyldig oppløsning:', resolution);
        let color = this.birdsPerHourColor;
        for (let i = 0; i < 24/resolution; i++) {
            hours.push(0);
            hoursLabel.push((i*resolution).toFixed(1));
            hoursColor.push(color);
        }
        this.labels = hoursLabel;
        for (let i = 0; i < this.data.length; i++) {
            let date = new Date(this.data[i].endtime);
            let hour = date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
            hours[Math.floor(hour/resolution)] += Number(this.data[i].birdminutes);
            //console.log(new Date(this.data[i].time));
        }
        this.datasets = [{
            label,
            barPercentage: 1,
            categoryPercentage: 1,
            data: hours,
            backgroundColor: hoursColor
        }];
        this.render();
    }
    showBirdsPerSpeed() {
        let label = 'Totalt antall fugleminutter pr fart';
        let speeds = [];
        let speedsLabel = [];
        let speedsColor = [];
        let resolution = this.birdsPerSpeedResolution;
        if (!resolution) return console.log('Ugyldig oppløsning:', resolution);
        let color = this.birdsPerSpeedColor;// ? this.birdsPerSpeedColor : '#000';
        let maxSpeed = Number(_.max(this.data, el => Number(el.speed)).speed);
        for (let i = 0; i < maxSpeed/resolution; i++) {
            speeds.push(0);
            speedsLabel.push((i*resolution).toFixed(1));
            speedsColor.push(color);
        }
        this.labels = speedsLabel;
        for (let i = 0; i < this.data.length; i++) {
            speeds[Math.floor(this.data[i].speed/resolution)] += Number(this.data[i].birdminutes);
            //console.log(new Date(this.data[i].time));
        }
        this.datasets = [{
            label,
            barPercentage: 1,
            categoryPercentage: 1,
            data: speeds,
            backgroundColor: speedsColor
        }];
        this.render();
    }
    setBirdsPerSpeedResolution(resolution) {
        this.birdsPerSpeedResolution = resolution;
    }
    showMonth() {
        let months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
        let label = `Viser fugleminutter pr dag for ${months[this.month.month]} ${this.month.year}`;
        let date = new Date(this.month.year, this.month.month);
        let obsPerDay = [];
        let tempPerDay = [];
        let humidityPerDay = [];
        let days = [];
        let colors = [];
        for (let i = 0; date.getTime() < new Date(this.month.year, this.month.month+1).getTime(); i++) {
            let obs = _.filter(this.data, el => {
                return new Date(el.endtime).toLocaleDateString() == date.toLocaleDateString();
            });
            obsPerDay.push(obs.reduce((a, b) => a + Number(b.birdminutes), 0));
            tempPerDay.push(obs.length ? obs.reduce((a, b) => a+Number(b.temperature), 0)/obs.length : undefined);
            humidityPerDay.push(obs.length ? obs.reduce((a, b) => a+Number(b.humidity), 0)/obs.length : undefined);
            days.push(i+1);
            colors.push(this.month.color);
            date = new Date(date.getTime()+24*3600*1000);
        }
        this.labels = days;
        this.datasets = [{
            label,
            data: obsPerDay,
            backgroundColor: colors
        }];
        if (this.month.temp) this.datasets.push({
            label: 'Temperatur[°C]',
            data: tempPerDay,
            borderColor: 'orange',
            type: 'line'
        });
        if (this.month.humidity) this.datasets.push({
            label: 'Luftfiktighet[%]',
            data: humidityPerDay,
            borderColor: 'blue',
            type: 'line'
        });
        this.render();
    }
    showLastDay() {
        let label = `Viser fugleminutter siste 24 timer`;
        const starttime = new Date().getTime() - 24 * 3600 * 1000;
        let date = new Date(starttime);
        let resolution = this.day.resolution;
        let obsPerHour = [];
        let tempPerHour = [];
        let humidityPerHour = [];
        let hours = [];
        let colors = [];
        for (let i = 0; date.getTime() < new Date().getTime() - 1000; i++) {
            let obs = _.filter(this.data, el => {
                return new Date(el.endtime).getTime() > new Date((i    ) * resolution * 3600 * 1000 + starttime).getTime() &&
                       new Date(el.endtime).getTime() < new Date((i + 1) * resolution * 3600 * 1000 + starttime).getTime();
            });
            obsPerHour.push(obs.reduce((a, b) => a + Number(b.birdminutes), 0));
            tempPerHour.push(obs.length ? obs.reduce((a, b) => a+Number(b.temperature), 0)/obs.length : undefined);
            humidityPerHour.push(obs.length ? obs.reduce((a, b) => a+Number(b.humidity), 0)/obs.length : undefined);
            const toHour = (i, resolution) => {
                let endtime = (new Date(starttime).getTime())/(3600 * 1000) + (i+1) * resolution;
                endtime %= 24;
                let hours = Math.floor(endtime);
                if (hours < 10) hours = `0${hours}`;
                let minutes = ((endtime - hours) * 60).toFixed(0);
                if (minutes < 10) minutes = `0${minutes}`;
                return `${hours}.${minutes}`;
            }
            hours.push(toHour(i, resolution));
            colors.push(this.day.color);
            date = new Date(date.getTime()+ resolution * 3600 * 1000);
        }
        this.labels = hours;
        this.datasets = [{
            label,
            barPercentage: 1,
            categoryPercentage: 1,
            data: obsPerHour,
            backgroundColor: colors
        }];
        if (this.day.temp) this.datasets.push({
            label: 'Temperatur[°C]',
            data: tempPerHour,
            borderColor: 'orange',
            type: 'line'
        });
        if (this.day.humidity) this.datasets.push({
            label: 'Luftfiktighet[%]',
            data: humidityPerHour,
            borderColor: 'blue',
            type: 'line'
        });
        this.render();
    }
}
