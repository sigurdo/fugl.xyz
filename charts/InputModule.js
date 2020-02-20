const graphFormats = [{
    name: 'Obs/turbin'
}, {
    name: 'Obs/time'
}, {
    name: 'Obs/fart',
    extraFields: [{
        name: 'Oppløsning',
        type: 'number',
        defaultValue: 1,
        onInput: (chart, newVal) => {
            chart.setBirdsPerSpeedResolution(Number(newVal));
        }
    }, {
        name: 'Farge',
        type: 'text',
        defaultValue: 'pink',
        onInput: (chart, newVal) => {
            console.log(newVal);
            $('body').css('background-color', newVal);
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

        let html = '<div id="grafFormat"><select>';
        for (let i = 0; i < this.formats.length; i++) {
            html += `<option value="${i}"> ${this.formats[i].name} </option>`;
        }
        html += '</select></div> <div id="extraFields"></div>';
        $(this.selector).html(html);

        if (localStorage.getItem('currentGrafFormat') == undefined) {
            localStorage.setItem('currentGrafFormat', 0);
        }
        this.applyGrafFormat();
        for (let i = 0; i < this.formats.length; i++) {
            if (!this.formats[i].extraFields) continue;
            for (let j = 0; j < this.formats[i].extraFields.length; j++) {
                let opt = this.formats[i].extraFields[j];
                let val = localStorage.getItem(`currentExtraFields-${i}-${j}`);
                if (val == undefined) {
                    localStorage.setItem(`currentExtraFields-${i}-${j}`, opt.defaultValue);
                    val = opt.defaultValue;
                }
                opt.onInput(this.chart, val);
            }
        }

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
        let html = '';
        for (let j = 0; j < this.formats[i].extraFields.length; j++) {
            let opt = this.formats[i].extraFields[j];
            if (opt.type == 'number') {
                html += `<div>${opt.name}: <input type="number" id="${j}"></div>`
            }
            if (opt.type == 'text') {
                html += `<div>${opt.name}: <input type="text" id="${j}"></div>`
            }
        }
        this.getjq('#extraFields').html(html);
        for (let j = 0; j < this.formats[i].extraFields.length; j++) {
            let opt = this.formats[i].extraFields[j];
            let el = this.getjq(`#extraFields>div>#${j}`);
            el.val(localStorage.getItem(`currentExtraFields-${i}-${j}`));
            el.on('input', ev => {
                localStorage.setItem(`currentExtraFields-${i}-${j}`, ev.target.value);
                opt.onInput(this.chart, ev.target.value);
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