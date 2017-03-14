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
  single_location_radius_doms = $('.single-location-safety')
  for (var i=0; i < single_location_radius_doms.length; i++ ) {
    single_location_radius_doms[i].innerText = data['radius'];
  }
  console.log(data);
  response = get_data_fake(data)

  $.ajax({
    url: '/city/safety',
    data: data,
    type: 'get',
    success: function(response) {
      $('.graph').hide();
      $('.single-graph').show();
      // set the single-summary-crime-below span value
      doms = $(".single-summary-crime-below")
      for (var i=0; i < doms.length; i++ ) {
        if (response['area total'] > response['city total average'] ) {
          doms[i].innerText = 'above'
        } else if (response['area total'] < response['city total average']) {
          doms[i].innerText = 'below'
        } else {
          doms[i].innerText = 'on par with'
        }
      }
      // set the single-summary-crime-rate span value
      doms = $(".single-summary-crime-rate")
      for (var i=0; i< doms.length; i++) {
        doms[i].innerText = parseInt((response['area total'] - response['city total average']) / response['city total average'] * 100) + '%'
      }
      // set the single-summary-crime-type
      doms = $(".single-summary-crime-type")
      var max_type = "violence";
      var max_value = response['area violence'];
      if (response['area residential'] > max_value) {
        max_type = 'residential';
        max_value = response['area residential'];
      }
      if (response['area property'] > max_value) {
        max_type = 'property';
        max_value = response['area property'];
      }
      for (var i=0; i< doms.length; i++) {
        doms[i].innerText = max_type;
      }

      // set the single-summary-noise-below
      doms = $(".single-summary-noise-below")
      if (response['noise']['score'] > response['noise']['locale']) {
        innerText = "high"
      } else if (response['noise']['score'] < response['noise']['locale']) {
        innerText = "low"
      } else {
        innerText = "moderate"
      }
      for (var i=0; i< doms.length; i++) {
        doms[i].innerText = innerText
      }

      // set the single-summary-noise-type
      doms = $(".single-summary-noise-type")
      var max_type = "airport";
      var max_value = response['noise']['airport'];
      if (response['noise']['locale'] > max_value) {
        max_type = "locale";
        max_value = response["noise"]["locale"];
      } else if (response['noise']['traffic'] > max_value) {
        max_type = "traffic";
        max_value = response["noise"]["traffic"];
      }
      for (var i=0; i< doms.length; i++) {
        doms[i].innerText = max_type;
      }

      // set the single-summary-crime-safe-not-safe
      doms = $('.single-summary-crime-safe-not-safe')
      if (response['area total'] > response['city total average']) {
        innerText = 'not save'
      } else {
        innerText = 'save'
      }
      for (var i=0; i<doms.length; i++ ) {
        doms[i].innerText = innerText
      }

      // redraw the convenient graph
      var convenientChart = echarts.init(document.getElementById('single-convenient-graph'));
      var convenientData = [
        response['life_result']['restaurant'],
        response['life_result']['shop'],
        response['life_result']['transport'],
      ]
      ConvenientOption = {
        title: {
            text: 'The result of googlemap',
            subtext: 'if the enumber is more than 100, it means 100+'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Convenient']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['restaurant', 'shop', 'transport'],
        },
        series: [
          {
            name: 'Convenient',
            type: 'bar',
            data: convenientData,
          }
        ]
      };
      convenientChart.setOption(ConvenientOption);
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
          data:['area','city']
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
            barGap: '0%',
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
        backgroundColor: '#fff',

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
          max: 2000,
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
                      color: 'rgba(0, 0, 0, 0.3)'
                  }
              }
            },
            labelLine: {
              normal: {
                  lineStyle: {
                      color: 'rgba(0, 0, 0, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 200,
                color: "#c23531",
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
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
                 { name: 'score', max: 100},
                 { name: 'traffic', max: 100},
                 { name: 'airport', max: 100},
                 { name: 'local', max: 100},
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
      $('#multi-location-radius')[0].innerText = data['radius'];
      $('.graph').hide();
      $('.multi-graph').show();
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
        var tmp = {'name': locations[i], 'type': 'bar', data: data_list, 'barGap': '0%'}
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
      // redraw the table
      var get_crime_score = function (local, city) {
        return (2 * city - local) / 2 * city
      }
      var get_noise_score = function (score) {
        return 2 * score - 100
      }
      results_for_table = [];
      for (var i=0; i<locations.length; i++) {
        data_dict = {
          // 'area total': results[i]['area total'] * crimeweight / 100,
          'area total': get_crime_score(results[i]['area total'], results[i]['city total average']),
          // 'noise': results[i]['noise']['score'] * noiseweight / 100,
          'noise': get_noise_score(results[i]['noise']['score']),
          'transport': results[i]['life_result']['transport'] * convenientweight / 100,
          'name': locations[i]
        };
        data_dict['score'] = data_dict['area total'] + data_dict['noise'] + data_dict['transport'];
        results_for_table.push(data_dict);
      }
      $("#multi-table").bootstrapTable('removeAll');
      $("#multi-table").bootstrapTable('refreshOptions', {
        columns: [
          {field: 'name', title: 'address', sortable: true},
          {field: 'area total', title: 'safety', sortable: true},
          {field: 'noise', title: 'noise level', sortable: true},
          {field: 'transport', title: 'convenient', sortable: true},
          {field: 'score', title: 'total', sortable: true},
        ],
        data: results_for_table,
      })

      // set the multi-summary-best-place
      doms = $(".multi-summary-best-place")
      var max_score = results_for_table[0]['score']
      var best_location = results_for_table[0]['name']
      for (var i=0; i<results_for_table.length; i++){
        if (results_for_table[i]['score'] > max_score ) {
          max_score = results_for_table[i]['score'];
          best_location = results_for_table[i]['name']
        }
      }
      for (var i=0; i<doms.length; i++) {
        doms[i].innerText = best_location;
      }

      // set the multi-summary-safe-place
      doms = $(".multi-summary-safe-place")
      var lowerest_crime = results_for_table[0]["area total"];
      var lowerest_place = results_for_table[0]["name"];
      for (var i=0; i< doms.length; i++ ) {
        if (results_for_table[0]["area total"] < lowerest_crime) {
          lowerest_crime = results_for_table[0]["area total"]
          lowerest_place = results_for_table[0]["name"]
        }
      }
      for (var i=0;i<doms.length; i++) {
        doms[i].innerText = lowerest_place
      }

      // redraw the radar graph

      var multiNoiseChart = echarts.init(document.getElementById('multi-noise-graph'));
      var multi_radar_data = []
      for (var i=0; i<locations.length; i++) {
        var tmp_data = {
          'name': locations[i],
          'value': [
            results[i]['noise']['score'],
            results[i]['noise']['traffic'],
            results[i]['noise']['airport'],
            results[i]['noise']['local'],
          ]
        }
        multi_radar_data.push(tmp_data)
      }
      MultiRadarOption = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            data: locations
        },
        radar: {
            // shape: 'circle',
            indicator: [
               { name: 'Score', max: 100},
               { name: 'traffic', max: 100},
               { name: 'airport', max: 100},
               { name: 'local', max: 100},
            ]
        },
        series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: multi_radar_data,
            // data : [
            //     {
            //         value : [43, 10, 28,50,],
            //         name : 'location1'
            //     },
            //      {
            //         value : [50, 14, 28, 31],
            //         name : 'location2'
            //     }
            // ]
        }]
      };
      multiNoiseChart.setOption(MultiRadarOption)

      // redraw the convenient graph
      var multiConvenientChart = echarts.init(document.getElementById('multi-convenient-graph'))
      var transport_data_list = []
      var shop_data_list = []
      var restaurant_data_list = []
      for (var i=0; i< locations.length; i++) {
        transport_data_list.push(results[i]['life_result']['transport']);
        shop_data_list.push(results[i]['life_result']['shop'])
        restaurant_data_list.push(results[i]['life_result']['restaurant'])
      }
      multiConvenientOption = {
		    tooltip : {
          trigger: 'axis',
          axisPointer : {  // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
		    },
		    legend: {
		        data: ['transport', 'shop','restaurant']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value'
		    },
		    yAxis: {
		        type: 'category',
		        data: locations
		    },
		    series: [
          {
            name: 'transport',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: transport_data_list,
          },
          {
            name: 'shop',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: shop_data_list,
          },
          {
            name: 'restaurant',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: restaurant_data_list,
          },
		    ]
		  };
      multiConvenientChart.setOption(multiConvenientOption);
    }
  });
}

var add_city_input = function() {
  var new_input = document.createElement('input')
  new_input.className = 'location form-control'
  new_input.type = 'text'
  new_input.value = '5455 S blackstone ave'
  $('#locations')[0].appendChild(new_input)
}

var init = function() {
  console.log("page loaded");

  // init the single city graph
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
          data:[120, 332, 301, 334]
      },
      {
          name:'city',
          type:'bar',
          data:[120, 132, 101, 134]
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
          {value:335, name:'violence'},
          {value:310, name:'residential'},
          {value:274, name:'property'},
        ].sort(function (a, b) { return a.value - b.value}),
        roseType: 'angle',
        label: {
          normal: {
              textStyle: {
                  color: 'rgba(0, 0, 0, 0.3)'
              }
          }
        },
        labelLine: {
          normal: {
              lineStyle: {
                  color: 'rgba(0, 0, 0, 0.3)'
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
                  value : [72, 50, 72, 89],
                  name : 'Noise info'
              },
          ]
      }]
  };
  singleRadioChart.setOption(singelRadioOption);
}
