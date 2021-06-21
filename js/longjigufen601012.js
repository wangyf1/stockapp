var ctx = loadChartCanvas('region');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "中国境内",
                backgroundColor: 'rgba(0, 102, 255, 1)',
                borderColor: 'rgba(0, 102, 255,1)',
                data: [91.1, 121.8, 148.0, 202.7, 331.2]
            },
            {
                label: "亚太地区",
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [18.5, 29.3, 42.1, 32.7, 75.2]
            },
            {
                label: "美洲地区",
                backgroundColor: 'rgba(255, 206, 86, 1)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: [5.6, 9.5, 19.3, 45.6, 88.4]
            },
            {
                label: "欧洲地区",
                backgroundColor: 'rgba(255, 51, 0, 1)',
                borderColor: 'rgba(255, 51, 0, 1)',
                data: [0.077, 3.1, 10.5, 47.8, 49.9]
            },
            {
                label: "非洲地区",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 0, 1)',
                data: [0, 0.00049, 0.024, 0.27, 1.09]
            }

        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按地区划分）（亿元）'
        },
        responsive: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                stacked: true
            }]
        }
    }
});

var ctx = loadChartCanvas('product');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "太阳能组件及电池",
                backgroundColor: 'rgba(0, 102, 255, 1)',
                borderColor: 'rgba(0, 102, 255,1)',
                data: [54.3, 95.6, 136.1, 150.7, 362.4]
            },
            {
                label: "硅片及硅棒",
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [50.7, 58.8, 64.4, 94.1, 155.1]
            },
            
            {
                label: "电站建设及服务",
                backgroundColor: 'rgba(255, 51, 0, 1)',
                borderColor: 'rgba(255, 51, 0, 1)',
                data: [0, 0, 6.81, 20.8,13.3]
            },
            {
                label: "电力",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 0, 1)',
                data: [0.590, 4.47, 7.97, 7.73,6.9]
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按不同产品划分）（亿元）'
        },
        responsive: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                stacked: true
            }]
        }
    }
});