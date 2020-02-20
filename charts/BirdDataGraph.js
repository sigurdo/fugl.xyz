class BirdDataGraph {
    constructor(ctx, data, turbineData) {
        this.graphFormatFuncs = ['showBirdsPerTurbine', 'showBirdsPerHour', 'showBirdsPerSpeed'];
        this.currentFormatNr = 0;
        this.ctx = ctx;
        this.data = data;
        this.turbineData = turbineData;
        this.type = 'bar';
        this.labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
        this.datasets = [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }];
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
        // this.render();
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
            backgroundColor: 'green'//turbineColors
        }];
        this.labels = turbineNames;
        this.render();
    }
    showBirdsPerHour() {
        let label = 'Antall observasjoner pr tidpunkt på døgnet';
        let hours = [];
        let hoursLabel = [];
        let hoursColor = [];
        for (let i = 0; i < 24; i++) {
            hours.push(0);
            hoursLabel.push(i);
            hoursColor.push('crimson')
        }
        this.labels = hoursLabel;
        for (let i = 0; i < this.data.length; i++) {
            hours[new Date(this.data[i].time).getHours()]++;
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
        let resolution = this.birdsPerSpeedResolution ? this.birdsPerSpeedResolution : 0.2;
        let maxSpeed = Number(_.max(this.data, el => Number(el.speed)).speed);
        for (let i = 0; i < maxSpeed/resolution; i++) {
            speeds.push(0);
            speedsLabel.push((i*resolution).toFixed(1));
            speedsColor.push('#abcdef');
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
}
