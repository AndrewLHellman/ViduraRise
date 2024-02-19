import React, { useRef, useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap'
import * as echarts from 'echarts';
import axios from 'axios';

const Daskboard = () => {
  const chartRef = useRef(null);
  const [upload, setUpload] = useState([])
  const [analyze, setAnalyze] = useState([])

  if (chartRef.current) {
    // Configure and set data for the chart here
    var myChart = echarts.init(chartRef.current, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        show: false,
        // feature: {
        //   dataView: { show: true, readOnly: false },
        //   magicType: { show: true, type: ['line', 'bar'] },
        //   restore: { show: true },
        //   saveAsImage: { show: true }
        // }
      },
      legend: {
        data: ['Upload', 'Analyze']
      },
      xAxis: [
        {
          type: 'category',
          data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: Math.max(...upload, ...analyze),
          interval: 2
        }
      ],
      series: [
        {
          name: 'Upload',
          type: 'bar',
          tooltip: {
          },
          data: upload
        },
        {
          name: 'Analyze',
          type: 'bar',
          data: analyze
        }
      ]
    };


    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);

  }
  
  useEffect(() => {
    // Initialize and render the chart inside the useEffect hook

    let config = {
      method: 'get',
      url: 'http://localhost:3200/dashboard',
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        const { status, data } = response.data
        if (status) {
          setUpload(Object.values(data?.upload));
          setAnalyze(Object.values(data?.analyze));
        }
      })
      .catch((error) => {
        console.log(error);
      });


  }, []);

  return (
    <div>
      <h5 className='fw-bold mb-3'>Week Summary of Images</h5>
      <Card>
        <CardBody>
          <div ref={chartRef} style={{ width: '100%', height: 'calc(100vh - 14rem)' }}>Graph will show here</div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Daskboard
