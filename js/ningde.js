// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

//Import Excel data
alasql.promise('select * from xlsx("../excel/ningde/exportedExcelNingde.xlsx",{range:"B2:AD32"})')
    .then(function(data){
        console.log(data);

        //Put excel data into array
        var timeKeys = Object.keys(data[0]).reverse(); //Date (日期)
        var profit = Object.values(data[0]).reverse(); //Profit （利润）
        var profitWithoutEx = Object.values(data[1]).reverse(); //profit without extraordinary item（扣非净利润）
        var revenue = Object.values(data[2]).reverse(); //Revenue （总营收）
        var grossProfit = Object.values(data[28]).reverse(); //Gross Profit （毛利）
        var operatingProfit = Object.values(data[13]).reverse(); //Operating Profit （营业利润）
        var fcf = Object.values(data[29]).reverse(); //Free cash flow (自由现金流)
        var capex = Object.values(data[4]).reverse(); //Capital Expenditure (资本性支出)
 
        for (let i=0;i<capex.length;i++){             //Capital Expenditure (资本性支出) 变成负数
            capex[i] = -1*capex[i];
        }
        var operatingCashFlow = Object.values(data[3]).reverse(); //operating cash flow (经营活动现金流)
        var sales = Object.values(data[9]).reverse(); //销售费用
        var management = Object.values(data[10]).reverse(); //管理费用
        var research = Object.values(data[11]).reverse(); //研究费用
        var accounting = Object.values(data[12]).reverse(); //财务费用
        var investmentCashFlow = Object.values(data[6]).reverse(); // 投资活动现金流
        var financingCashFlow = Object.values(data[7]).reverse(); // 投资活动现金流
        var timeKeysYear = Object.values(data[16]).reverse() //日期（按年算）
        //remove weird elements from timeKeysYear
        for(let i = 0; i < timeKeysYear.length; i++){
            if(timeKeysYear[i] < 2000){
                timeKeysYear.shift();
                i=i-1;
            }
        }

        //倒入所有负债表数据 并做成跟“日期（按年算）”一样长度
        var liquidAsset = Object.values(data[18]).reverse() //流动资产
        liquidAsset.splice(0,liquidAsset.length - timeKeysYear.length)

        var fixedAsset = Object.values(data[20]).reverse() //固定资产
        fixedAsset.splice(0,fixedAsset.length - timeKeysYear.length)

        var currentLiability = Object.values(data[22]).reverse() //流动负债
        currentLiability.splice(0,currentLiability.length - timeKeysYear.length)

        var longTermLiability = Object.values(data[23]).reverse() //非流动负债
        longTermLiability.splice(0,longTermLiability.length - timeKeysYear.length)

        var stockholderEquity = Object.values(data[26]).reverse() //股东权益
        stockholderEquity.splice(0,stockholderEquity.length - timeKeysYear.length)



        Chart.defaults.global.defaultFontSize = 15;

//all charts

        //Chart: Profit
        var ctx = document.getElementById('profit');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "净利润（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: profit
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '净利润（亿元）'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                    }]
                }
            }
        });

        //Chart: Revenue
        var ctx = document.getElementById('revenue');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "营业总收入（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: revenue
                    },

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '营业总收入（亿元）'
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

        //Profit vs. Profit without Extraordinary items
        var ctx = document.getElementById('profitWithoutEx'); //扣非净利润 vs. 净利润
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "扣非净利润（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: profitWithoutEx
                    },
                    {
                        label: "净利润（亿元）",
                        backgroundColor: 'rgba(255, 51, 0, 0.7)',
                        borderColor: 'rgba(255, 51, 0, 0.7)',
                        data: profit
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '扣非净利润 vs. 净利润（亿元）'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                }
            }
        });

        //营业总收入 vs. 毛利 vs. 营业利润
        var ctx = document.getElementById('gross'); //营业总收入 vs. 毛利 vs. 营业利润
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "营业总收入（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: revenue
                    },
                    {
                        label: "毛利（亿元）",
                        backgroundColor: 'rgba(255, 51, 0, 0.7)',
                        borderColor: 'rgba(255, 51, 0, 0.7)',
                        data: grossProfit
                    },
                    {
                        label: "营业利润（亿元）",
                        backgroundColor: 'rgba(0, 151, 0, 0.7)',
                        borderColor: 'rgba(0, 151, 0, 0.7)',
                        data: operatingProfit
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '营业总收入 vs. 毛利 vs. 营业利润（亿元）'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                }
            }
        });

        //营业费用分解
        var ctx = document.getElementById('operating_expense'); // Operating Expense Breakdown
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "销售费用（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: sales
                    },
                    {
                        label: "管理费用（亿元）",
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: management
                    },
                    {
                        label: "研发费用（亿元）",
                        backgroundColor: 'rgba(255, 206, 86, 1)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        data: research
                    },
                    {
                        label: "财务费用（亿元）",
                        backgroundColor: 'rgba(255, 51, 0, 1)',
                        borderColor: 'rgba(255, 51, 0, 1)',
                        data: accounting
                    }

                ]
            },
            options: {
                tooltips: {
                    mode: 'index',
                    callbacks: {
                        footer: (tooltipItems, data) => {
                        let total = tooltipItems.reduce((a, e) => a + parseFloat(e.yLabel), 0);
                        return '总营业费用（亿元）: ' + total.toFixed(2);
                        }
                    }
                },
                title: {
                    display: true,
                    text: '营业费用分类（亿元）'
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

        //Free cash flow vs. capEx vs. Operating Cash flow
        var ctx = document.getElementById('FCF');  //自由现金流 vs. 资本性支出 vs. 经营现金流
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "经营活动现金流（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: operatingCashFlow
                    },
                    {
                        label: "资本性支出（亿元）",
                        backgroundColor: 'rgba(255, 51, 0, 0.7)',
                        borderColor: 'rgba(255, 51, 0, 0.7)',
                        data: capex
                    },
                    {
                        label: "自由现金流（亿元）",
                        backgroundColor: 'rgba(0, 151, 0, 0.7)',
                        borderColor: 'rgba(0, 151, 0, 0.7)',
                        data: fcf
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '自由现金流 vs. 资本性支出 vs. 经营现金流 (亿元)'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                }
            }
        });

        //现金流来源对比
        var ctx = document.getElementById('cash_flow'); //现金流来源对比
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "经营活动现金流（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: operatingCashFlow
                    },
                    {
                        label: "投资活动现金流（亿元）",
                        backgroundColor: 'rgba(255, 51, 0, 0.7)',
                        borderColor: 'rgba(255, 51, 0, 0.7)',
                        data: investmentCashFlow
                    },
                    {
                        label: "筹资活动现金流（亿元）",
                        backgroundColor: 'rgba(0, 151, 0, 0.7)',
                        borderColor: 'rgba(0, 151, 0, 0.7)',
                        data: financingCashFlow
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '现金流来源对比（亿元）'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        ticks: {
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                }
            }
        });
        

        //资产负债明细
        var ctx = document.getElementById('balance_detailed'); //资产负债（流动非流动）
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeysYear,
                datasets: [
                    {
                        type: 'line',
                        label: "股东权益（亿元）",
                        borderColor: 'rgba(75, 204, 230,1)',
                        backgroundColor: 'rgba(75, 204, 230,0)',
                        borderwidth: 2,
                        data: stockholderEquity
                    },
                    {
                        type: 'bar',
                        label: "流动资产 （亿元）",
                        stack: 'stack0',
                        backgroundColor: 'rgba(0, 151, 0, 0.7)',
                        borderColor: 'rgba(0, 151, 0, 0.7)',
                        data: liquidAsset
                    },
                    {
                        type: 'bar',
                        label: "非流动资产 （亿元）",
                        stack: 'stack0',
                        backgroundColor: 'rgba(224, 30, 30, 0.7)',
                        borderColor: 'rgba(224, 30, 30, 0.7)',
                        data: fixedAsset
                    },
    
                    {
                        type: 'bar',
                        label: "流动负债 （亿元）",
                        stack: 'stack1',
                        backgroundColor: 'rgba(233, 141, 36, 0.7)',
                        borderColor: 'rgba(233, 141, 36, 0.7)',
                        data: currentLiability
                    },
                    {
                        type: 'bar',
                        label: "非流动负债 （亿元）",
                        stack: 'stack1',
                        backgroundColor: 'rgba(0, 51, 200, 0.7)',
                        borderColor: 'rgba(0, 51, 200, 0.7)',
                        data: longTermLiability
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: '资产负债情况'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                }
            }
        });















    }).catch(function(err){
    console.log('There was an error reading the source file.:', err);
});


  

 
