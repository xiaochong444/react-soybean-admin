import { Card } from 'antd';
import { getLocale } from '@/store/slice/app';
const LineChart = memo(() => {
  const { t } = useTranslation();
  const locale = useAppSelector(getLocale);
  const { domRef, updateOptions } = useEcharts(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [t('page.home.downloadCount'), t('page.home.registerCount')]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [] as string[]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        color: '#8e9dff',
        name: t('page.home.downloadCount'),
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.25,
                color: '#8e9dff'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: [] as number[]
      },
      {
        color: '#26deca',
        name: t('page.home.registerCount'),
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.25,
                color: '#26deca'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      }
    ]
  }));

  async function mockData() {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    updateOptions(opts => {
      opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
      opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
      opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

      return opts;
    });
  }


  function init() {
    mockData();
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory();
      opts.legend.data = originOpts.legend.data;
      opts.series[0].name = originOpts.series[0].name;
      opts.series[1].name = originOpts.series[1].name;

      return opts;
    });
  }
  // init

  useMount(() => {
    init();
  });

  useUpdateEffect(() => {
    updateLocale();
  }, [locale]);
  return (
    <Card
      bordered={false}
      className="card-wrapper"
    >
      <div
        ref={domRef}
        className="h-360px overflow-hidden"
      ></div>
    </Card>
  );
});

export default LineChart;
