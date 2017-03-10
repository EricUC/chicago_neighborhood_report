var get_data_fake = function(data) {
  return {
    'area total': 2053,
    'city total average': 6994,
    'area violence': 352,
    'city violence average': 1519,
    'area residential': 772,
    'city residential average': 2432,
    'area property': 929,
    'city property average': 3042,
  }
}
var get_safety = function(dom) {
  console.log(wx=dom)
  data = {
    'location': $('#location')[0].value,
    'radius': $('#radius')[0].value,
  };
  console.log(data);
  response = get_data_fake(data)

  $.ajax({
    url: '/city/safety',
    data: data,
    type: 'get',
    success: function(response) {
      //  redraw the column graph
      var singleChart = echarts.init(document.getElementById('single-graph'));
      singleOption = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {
              type : 'shadow'
          }
        },
        legend: {
          data:['area','total']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : ['total','violence','residential','property']
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'area',
            type:'bar',
            data: [
              response['area total'],
              response['area violence'],
              response['area residential'],
              response['area property'],
            ]
          },
          {
            name:'city',
            type:'bar',
            data: [
              response['city total average'],
              response['city violence average'],
              response['city residential average'],
              response['city property average'],
            ]
          },
        ]
      };
      singleChart.setOption(singleOption)
      // redraw the pie graph
      var singlePieChart = echarts.init(document.getElementById('single-pie-graph'));
      singlePieOption = {
        backgroundColor: '#2c343c',

        title: {
          text: 'Crime Pie',
          left: 'center',
          top: 20,
          textStyle: {
              color: '#ccc'
          }
        },

        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
              colorLightness: [0, 1]
          }
        },
        series : [
          {
            name:'type',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
              {value:response['area violence'], name:'violence'},
              {value:response['area residential'], name:'residential'},
              {value:response['area property'], name:'property'},
            ].sort(function (a, b) { return a.value - b.value}),
            roseType: 'angle',
            label: {
              normal: {
                  textStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                  }
              }
            },
            labelLine: {
              normal: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              }
            },
            itemStyle: {
              normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
          }
        ]
      };
      singlePieChart.setOption(singlePieOption);

      // redraw the radio graph
      var singleRadioChart = echarts.init(document.getElementById('single-radio-graph'));
      noise_values = [
        response['noise']['score'],
        response['noise']['traffic'],
        response['noise']['airport'],
        response['noise']['local'],
      ]
      singelRadioOption = {
          title: {
              text: 'Noise Graph'
          },
          tooltip: {},
          legend: {
              data: ['Noise info']
          },
          radar: {
              // shape: 'circle',
              indicator: [
                 { name: 'score', max: 200},
                 { name: 'traffic', max: 200},
                 { name: 'airport', max: 200},
                 { name: 'local', max: 200},
              ]
          },
          series: [{
              name: 'noise ',
              type: 'radar',
              // areaStyle: {normal: {}},
              data : [
                  {
                      value : noise_values,
                      name : 'Noise info'
                  },
              ]
          }]
      };
      singleRadioChart.setOption(singelRadioOption);

    }
  });
}

var get_rank = function(dom) {
  locations = []
  doms = document.getElementsByClassName('location')
  for (var i=0; i< doms.length; i++ ) {
    locations.push(doms[i].value)
  }
  data = {'locations': locations}
  data['radius'] = document.getElementById('radius2').value
  console.log("get the location data")

  // give me the fake data
  // results = []
  // for (var i=0; i< data['locations'].length; i++ ) {
  //   results.push(get_data_fake(data['locations'][i]))
  // }
  $.ajax({
    url: '/city/rank/',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    type: 'post',
    success: function(response) {
      results = response['results'];  // use the actual data
      // redraw the multi graph
      var multiChart = echarts.init(document.getElementById('multi-graph'));
      // get series
      var series = []
      for (var i=0; i<locations.length; i++ ) {
        data_list = [
          results[i]['area total'],
          results[i]['area violence'],
          results[i]['area residential'],
          results[i]['area property'],
        ]
        var tmp = {'name': locations[i], 'type': 'bar', data: data_list}
        series.push(tmp)
      }
      multiOption = {
        tooltip : {
          trigger: 'axis',
          axisPointer : { type : 'shadow' }
        },
        legend: { data: locations, },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : ['total','violence','residential','property']
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : series,
      };
      multiChart.setOption(multiOption)

      var crimeweight = parseInt($("#crime-weight")[0].value);
      var noiseweight = parseInt($("#noise-weight")[0].value);
      var convenientweight = parseInt($("#convenient-weight")[0].value);
      // calculate the result
      results_for_table = [];
      for (var i=0; i<locations.length; i++) {
        data_dict = {
          'area total': results[i]['area total'] * crimeweight / 100,
          'noise': results[i]['noise']['score'] * noiseweight / 100,
          'transport': results[i]['life_result']['transport'] * convenientweight / 100,
          'name': locations[i]
        };
        data_dict['score'] = data_dict['area total'] + data_dict['noise'] + data_dict['transport'];
        results_for_table.push(data_dict);
      }
      $("#multi-table").bootstrapTable('removeAll');
      $("#multi-table").bootstrapTable('refreshOptions', {
        columns: [
          {field: 'name', title: 'name', sortable: true},
          {field: 'area total', title: 'crime/' + crimeweight, sortable: true},
          {field: 'noise', title: 'noise/' + noiseweight, sortable: true},
          {field: 'transport', title: 'convenient/' + convenientweight, sortable: true},
          {field: 'score', title: 'total', sortable: true},
        ],
        data: results_for_table,
      })
    }
  });
}

var add_city_input = function() {
  var new_input = document.createElement('input')
  new_input.className = 'location'
  new_input.type = 'text'
  new_input.value = '5455 S blackstone ave'
  $('#locations')[0].appendChild(new_input)
}

var init = function() {
  console.log("page loaded");

  // init the single city graph    # single_graph
  var singleChart = echarts.init(document.getElementById('single-graph'));
  singleOption = {
    tooltip : {
      trigger: 'axis',
      axisPointer : {
          type : 'shadow'
      }
    },
    legend: {
      data:['Toggle Area','Toggle City Average']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['Total','Violence','Residential','Property']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
          name:'Toggle Area',
          type:'bar',
          data:[967, 332, 301, 334]
      },
      {
          name:'Toggle City Average',
          type:'bar',
          data:[367, 132, 101, 134]
      },
    ]
  };
  singleChart.setOption(singleOption)




  var multiChart = echarts.init(document.getElementById('multi-graph'));
  multiOption = {
    tooltip : {
      trigger: 'axis',
      axisPointer : {
          type : 'shadow'
      }
    },
    legend: {
      data:['location1','location2','location3']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true


    }, //#@2 multi_chart

    xAxis : [
      {
        type : 'category',
        data : ['Total','Violence','Residential','Property']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
          name:'location1',
          type:'bar',
          data:[120, 332, 301, 334]
      },
      {
          name:'location2',
          type:'bar',
          data:[120, 132, 101, 134]
      },
      {
          name:'location3',
          type:'bar',
          data:[120, 132, 101, 134]
      },
    ]
  };
  multiChart.setOption(multiOption)


  // init the slider
  console.log("init the slider")
  var crimeSlider = $("#crime-weight").slider();
  var noiseSlider = $("#noise-weight").slider();
  var convenientSlider = $("#convenient-weight").slider();


  // init the table
  console.log("init the table")
  $("#multi-table").bootstrapTable({
    columns: [
      {field: 'name', title: 'name', sortable: true},
      {field: 'area total', title: 'crime/1', sortable: true},
      {field: 'noise', title: 'noise/1', sortable: true},
      {field: 'transport', title: 'convenient/1', sortable: true},
      {field: 'total', title: 'total', sortable: true},
    ],
    data: [
      {'name': 'location1', 'score': 80, 'area total': 14, 'noise': 43, 'transport': 63,},
      {'name': 'location2', 'score': 70, 'area total': 13, 'noise': 33, 'transport': 33,},
    ],
  })


  // init the pie graph
  var singlePieChart = echarts.init(document.getElementById('single-pie-graph'));
  singlePieOption = {
    //backgroundColor: '#000000',

    title: {
      text: 'Crime Category Breakdown',
      left: 'center',
      top: 20,
      textStyle: {
          color: '#000'
      }
    },

    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
          colorLightness: [0, 1]
      }
    },
    series : [
      {
        name:'type',
        type:'pie',
        radius : '55%',
        center: ['50%', '50%'],
        data:[
          {value:335, name:'violence'},
          {value:310, name:'residential'},
          {value:274, name:'property'},
        ].sort(function (a, b) { return a.value - b.value}),
        roseType: 'angle',
        label: {
          normal: {
              textStyle: {
                  color: 'rgba(0, 0, 0, 0.7)'
              }
          }
        },
        labelLine: {
          normal: {
              lineStyle: {
                  color: 'rgba(0, 0, 0, 0.7)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
          }
        },
        itemStyle: {
          normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
            return Math.random() * 200;
        }
      }
    ]
  };
  singlePieChart.setOption(singlePieOption);


  // init the radio graph
  var singleRadioChart = echarts.init(document.getElementById('single-radio-graph'));
  singelRadioOption = {
      title: {
          text: 'Noise Graph',
          left: 'center',
          top:-5,

      },
      tooltip: {},
      legend: {
          data: ['Noise info'],
          left:'right',
      },
      radar: {
          // shape: 'circle', radar_label
          indicator: [
             { name: 'Overall', max: 200},
             { name: 'Traffic', max: 200},
             { name: 'Airport', max: 200},
             { name: 'Local', max: 200},
          ]
      },
      series: [{
          name: 'noise ',
          type: 'radar',
          // areaStyle: {normal: {}},
          data : [
              {
                  value : [72, 50, 72, 89],
                  name : 'Noise info'
              },
          ]
      }]
  };
  singleRadioChart.setOption(singelRadioOption);
}
