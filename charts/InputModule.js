const graphFormats = [{
    name: 'Observasjoner/turbin'
}, {
    name: 'Observasjoner/time',
    extraFields: [{
        name: 'Farge',
        type: 'color',
        defaultValue: '#dc143c',//'crimson',
        onInput: (chart, newVal) => {
            chart.birdsPerHourColor = newVal;
        }
    }, {
        name: 'Oppløsning',
        type: 'number',
        defaultValue: 1,
        onInput: (chart, newVal) => {
            newVal = Number(newVal);
            if (!newVal) return;// newVal = graphFormats[1].extraFields[0].defaultValue;
            chart.birdsPerHourResolution = newVal;
        }
    }]
}, {
    name: 'Observasjoner/fart',
    extraFields: [{
        name: 'Farge',
        type: 'color',
        defaultValue: '#64b5f6',
        onInput: (chart, newVal) => {
            chart.birdsPerSpeedColor = newVal;
        }
    }, {
        name: 'Oppløsning',
        type: 'number',
        defaultValue: 0.2,
        onInput: (chart, newVal) => {
            newVal = Number(newVal);
            if (!newVal) return;// newVal = graphFormats[2].extraFields[1].defaultValue;
            chart.setBirdsPerSpeedResolution(newVal);
        }
    }]
}, {
    name: 'Måned',
    extraFields: [{
        name: 'Farge',
        type: 'color',
        defaultValue: '#8e24aa',
        onInput: (chart, newVal) => {
            chart.month.color = newVal;
        }
    }, {
        name: 'År',
        type: 'select',
        defaultValue: new Date().getFullYear(),
        onInput: (chart, newVal) => {
            chart.month.year = Number(newVal);
            return true; // Dette betyr at input-skjemaet må refreshes etter input her
        },
        generateOptions: (chart, data, turbineData) => {
            let years = new Set();
            for (let i = 0; i < data.length; i++) {
                years.add(new Date(data[i].time).getFullYear());
            }
            years.add(new Date().getFullYear());
            let res = [];
            for (let item of years) {
                res.push({ value: item, name: item });
            }
            return res;
        }
    }, {
        name: 'Måned',
        type: 'select',
        defaultValue: new Date().getMonth(),
        onInput: (chart, newVal) => {
            chart.month.month = Number(newVal);
        },
        generateOptions: (chart, data, turbineData) => {
            let year = chart.month.year;
            let months = new Set();
            for (let i = 0; i < data.length; i++) {
                if (new Date(data[i].time).getFullYear() != year) continue;
                months.add(new Date(data[i].time).getMonth());
            }
            months.add(new Date().getMonth());
            monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
            let res = [];
            for (let item of months) {
                res.push({ value: item, name: monthNames[item] });
            }
            return res;
        }
    }, {
        name: 'Vis temperatur',
        type: 'checkbox',
        defaultValue: true,
        onInput: (chart, newVal) => {
            chart.month.temp = newVal;
        }
    }, {
        name: 'Vis fuktighet',
        type: 'checkbox',
        defaultValue: true,
        onInput: (chart, newVal) => {
            chart.month.humidity = newVal;
        }
    }]
}];

class InputModule {
    constructor(htmlId, chart) {
        this.htmlId = htmlId;
        this.selector = `#${this.htmlId}`;
        //this.jq = $(this.selector);
        this.chart = chart;
        this.formats = graphFormats;
        if (localStorage.getItem('currentGrafFormat') == undefined) {
            localStorage.setItem('currentGrafFormat', 0);
        }
        for (let i = 0; i < this.formats.length; i++) {
            if (!this.formats[i].extraFields) continue;
            for (let j = 0; j < this.formats[i].extraFields.length; j++) {
                let opt = this.formats[i].extraFields[j];
                let val = localStorage.getItem(`currentExtraFields-${i}-${j}`);
                if (val == undefined) {
                    localStorage.setItem(`currentExtraFields-${i}-${j}`, opt.defaultValue);
                    val = opt.defaultValue;
                }
                opt.onInput(this.chart, opt.type == 'checkbox' ? JSON.parse(val) : val);
            }
        }
    }
    setData(data) {
        this.data = data;
    }
    setTurbineData(data) {
        this.turbineData = data;
    }
    render() {
        let html = '<div id="grafFormat"> Modus: <select>';
        for (let i = 0; i < this.formats.length; i++) {
            html += `<option value="${i}"> ${this.formats[i].name} </option>`;
        }
        html += '</select></div> <div id="extraFields"></div>';
        $(this.selector).html(html);
        this.applyGrafFormat();
        this.getjq('#grafFormat>select').on('input', ev => {
            let value = Number(ev.target.value);
            this.applyGrafFormat(value);
            if (value != 0) $('#map').hide();
        });
    }
    renderExtraFields(formatNr) {
        if (!this.formats[formatNr].extraFields) {
            this.getjq('#extraFields').html('');
            return;
        }
        let i = formatNr;
        let html = '<table>';
        for (let j = 0; j < this.formats[i].extraFields.length; j++) {
            let opt = this.formats[i].extraFields[j];
            html += `<tr><td><label for="${j}">${opt.name}</label>:</td><td>`;
            if (opt.type == 'text' || opt.type == 'number' || opt.type == 'checkbox' || opt.type == 'color') {
                html += `<input type="${opt.type}" id="${j}" step="0.01">`;
            }
            else if (opt.type == 'select') {
                html += `<select id="${j}">`;
                let options = opt.generateOptions(this.chart, this.data, this.turbineData);
                for (let k = 0; k < options.length; k++) {
                    html += `<option value="${options[k].value}"> ${options[k].name} </option>`;
                }
                html += `</select>`;
            }
            html += `</td><td> <button id="default-${j}"> Default </button></tr>`;
        }
        html += '</table>';
        this.getjq('#extraFields').html(html);
        for (let j = 0; j < this.formats[i].extraFields.length; j++) {
            let opt = this.formats[i].extraFields[j];
            let el = this.getjq(`#extraFields>table>tbody>tr>td>#${j}`);
            el.val(localStorage.getItem(`currentExtraFields-${i}-${j}`));
            if (el.attr('type') == 'checkbox') el.prop('checked', JSON.parse(localStorage.getItem(`currentExtraFields-${i}-${j}`)));
            el.on('input', ev => {
                if (ev.target.type == 'checkbox') ev.target.value = ev.target.checked;
                localStorage.setItem(`currentExtraFields-${i}-${j}`, ev.target.value);
                if (opt.onInput(this.chart, el.attr('type') == 'checkbox' ? JSON.parse(ev.target.value) : ev.target.value)) this.applyGrafFormat();
                chart.show();
            });
            let el2 = this.getjq(`#extraFields>table>tbody>tr>td>#default-${j}`);
            el2.on('click', ev => {
                el.val(opt.defaultValue);
                if (el.attr('type') == 'checkbox') el.prop('checked', opt.defaultValue);
                localStorage.setItem(`currentExtraFields-${i}-${j}`, opt.defaultValue);
                if (opt.onInput(this.chart, opt.defaultValue)) this.applyGrafFormat();
                chart.show();
            });
        }
    }
    getjq(selector) {
        return $(`${this.selector}>${selector}`);
    }
    applyGrafFormat(newVal) {
        if (newVal !== undefined) localStorage.setItem('currentGrafFormat', newVal);
        let value = localStorage.getItem('currentGrafFormat');
        this.getjq('#grafFormat>select').val(value);
        this.chart.show(value);
        this.renderExtraFields(value);
    }
}