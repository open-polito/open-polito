import moment from 'moment';
import {PermanentMark} from 'open-polito-api/lib/courses';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useWindowDimensions, View} from 'react-native';
import LineChart, {
  LineChartData,
} from 'react-native-chart-kit/dist/line-chart/LineChart';
import colors from '../../colors';
import {p} from '../../scaling';
import Text from '../../ui/core/Text';

const Progress = ({marks, dark}: {marks: PermanentMark[]; dark: boolean}) => {
  const {t} = useTranslation();
  const width = useWindowDimensions().width;

  /**
   * Marks sorted by date ascending and filtered to be at most 1 year ago
   */
  const sorted_marks = useMemo(() => {
    return [
      ...marks.filter(
        mark =>
          parseInt(mark.mark) &&
          moment.duration(Date.now() - mark.date).asDays() <= 365,
      ),
    ].sort((mark1, mark2) => mark1.date - mark2.date);
  }, [marks]);

  /**
   * Weighted averages over time
   */
  const avgs = useMemo(() => {
    let _avgs = new Array<number>(sorted_marks.length);
    let weights = 0; // Cumulative weight counter

    for (let i = 0; i < sorted_marks.length; i++) {
      if (i == 0) {
        weights += sorted_marks[i].num_credits;
        _avgs[i] = parseInt(sorted_marks[i].mark) || 0;
      } else {
        _avgs[i] =
          (_avgs[i - 1] * weights +
            (parseInt(sorted_marks[i].mark) || 0) *
              sorted_marks[i].num_credits) /
          (weights + sorted_marks[i].num_credits);
        weights += sorted_marks[i].num_credits;
      }
    }

    return _avgs;
  }, [sorted_marks]);

  /**
   * Data for the chart
   */
  const data = useMemo<LineChartData>(
    () => ({
      labels: sorted_marks.map(mark => moment(mark.date).format('MMM D')),
      datasets: [
        {
          data: avgs,
          color: () => colors.accent300,
          strokeWidth: 2 * p,
        },
      ],
      legend: [t('weightedAverage')],
    }),
    [sorted_marks, avgs, t],
  );

  return sorted_marks.length == 0 ? (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <Text s={12} w="m" c={dark ? colors.gray200 : colors.gray700}>
        You'll see your progress when you get at least 1 permament mark.
      </Text>
    </View>
  ) : (
    <LineChart
      data={data}
      width={width}
      height={220}
      yAxisInterval={1}
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: colors.gray900,
        backgroundGradientTo: colors.gray700,
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: colors.accent300,
        },
      }}
      style={{
        borderRadius: 4 * p,
        transform: [{translateX: -16 * p}],
      }}
    />
  );
};

export default Progress;
