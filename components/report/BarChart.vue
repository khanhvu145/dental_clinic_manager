<template>
    <div :style='`width: ${width};height: ${height}`'>
        <canvas ref='myChart' :width='width' :height='height'></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
export default {
    props: {
        // The canvas's width.
        width: {
            type: Number,
            validator: value => value > 0
        },
        // The canvas's height.
        height: {
            type: Number,
            validator: value => value > 0
        },
        // The chart's data.labels
        labels: {
            type: Array
        },
        // The chart's data.datasets
        datasets: {
            type: Array,
            require: true
        },
        // The chart's options.
        options: {
            type: Object
        }
    },
    data() {
        return {
            // Data that will hold the Chart.js instance.
            chart: null 
        }
    },
    watch: {
        datasets(newDatasets){
            // Replace the datasets and call the update() method on Chart.js
            // instance to re-render the chart.
            const _this = this;
            _this.chart.data.datasets = newDatasets;
            _this.chart.update();
        }
    },
    mounted(){
        const _this = this;
        Chart.plugins.register(ChartDataLabels);
        _this.chart = new Chart(_this.$refs.myChart, {
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
                labels: _this.labels,
                datasets: _this.datasets
            },
            options: _this.options
        });
    },
    methods: {
        updateChart(){
            const _this = this;
            _this.chart.update();
        }
    }
}
</script>