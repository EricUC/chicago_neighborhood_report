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
    'transport': 24,
    'total': 26,
    'noise': 72,
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
  // $.ajax({
  //   url: '/city/safety',
  //   data: data,
  //   type: 'get',
  //   success: function(response) {
  //     document.getElementById("result").innerText = JSON.stringify(response)
  //   }
  // });
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
  results = []
  for (var i=0; i< data['locations'].length; i++ ) {
    results.push(get_data_fake(data['locations'][i]))
  }
  // redraw the multi graph
  var multiChart = echarts.init(document.getElementById('multi-graph'));
  // get series
  var series = []
  for (var i=0; i<locations.length; i++ ) {
    data_list = [
      results[i]['city total average'],
      results[i]['city violence average'],
      results[i]['city residential average'],
      results[i]['city property average'],
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
  // $.ajax({
  //   url: '/city/rank/',
  //   data: JSON.stringify(data),
  //   contentType: "application/json; charset=utf-8",
  //   type: 'post',
  //   success: function(response) {
  //     document.getElementById("result2").innerText = JSON.stringify(response)
  //   }
  // });

  // reset the table value
  console.log("reset the table")
  console.log(results)
  var crimeweight = $("#crime-weight")[0].value;
  var noiseweight = $("#noise-weight")[0].value;
  var convenientweight = $("#convenient-weight")[0].value;
  $("#multi-table").bootstrapTable('removeAll');
  $("#multi-table").bootstrapTable('refreshOptions', {
    columns: [
      {field: 'area total', title: 'crime/' + crimeweight, sortable: true},
      {field: 'noise', title: 'noise/' + noiseweight, sortable: true},
      {field: 'transport', title: 'convenient/' + convenientweight, sortable: true},
      {field: 'total', title: 'total', sortable: true},
    ],
    data: results,
  })

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
      data:['city1','city2','city3']
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
          name:'city1',
          type:'bar',
          data:[120, 332, 301, 334]
      },
      {
          name:'city2',
          type:'bar',
          data:[120, 132, 101, 134]
      },
      {
          name:'city3',
          type:'bar',
          data:[120, 132, 101, 134]
      },
    ]
  };
  multiChart.setOption(multiOption)


  // init the slider
  var crimeSlider = $("#crime-weight").slider();
  var noiseSlider = $("#noise-weight").slider();
  var convenientSlider = $("#convenient-weight").slider();


  // init the table
  $("#multi-table").bootstrapTable({
    columns: [
      {field: 'name', title: 'City', sortable: true,},
      {field: 'score', title: 'Score', sortable: true,},
    ],
    data: [
      {'name': 'city1', 'score': 80,},
      {'name': 'city2', 'score': 70,},
    ],
  })
}
