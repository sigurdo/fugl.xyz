class BirdDataGraph {
    constructor(ctx, data, turbineData) {
        this.graphFormatFuncs = ['showBirdsPerTurbine', 'showBirdsPerHour', 'showBirdsPerSpeed', 'showMonth'];
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
        let label = 'Antall obsevasjoner pr vindmølle';
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
                if (this.data[i].turbine_id == turbine_ids[j]) turbine_obs[j]++;
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
        let label = 'Antall observasjoner pr tidpunkt på døgnet';
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
            let date = new Date(this.data[i].time);
            let hour = date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
            hours[Math.floor(hour/resolution)]++;
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
        let label = 'Antall observasjoner for ulik fart';
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
            speeds[Math.floor(this.data[i].speed/resolution)]++;
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
        let label = `Viser observasjoner for ${months[this.month.month]} ${this.month.year}`;
        let date = new Date(this.month.year, this.month.month);
        let obsPerDay = [];
        let tempPerDay = [];
        let humidityPerDay = [];
        let days = [];
        let colors = [];
        for (let i = 0; date.getTime() < new Date(this.month.year, this.month.month+1).getTime(); i++) {
            let obs = _.filter(this.data, el => {
                return new Date(el.time).toLocaleDateString() == date.toLocaleDateString();
            });
            obsPerDay.push(obs.length);
            tempPerDay.push(obs.length ? obs.reduce((a, b) => a+Number(b.temperature), 0)/obs.length :
                this.data.reduce((a, b) => a + Number(b.temperature), 0)/this.data.length);
            humidityPerDay.push(obs.length ? obs.reduce((a, b) => a+Number(b.humidity), 0)/obs.length : 
                this.data.reduce((a, b) => a + Number(b.humidity), 0)/this.data.length);
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
}
