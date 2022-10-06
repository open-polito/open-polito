import moment, {Moment} from 'moment';
import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import colors from '../../colors';
import {p} from '../../scaling';
import Text from '../../ui/core/Text';

const TimetableGrid = ({
  showLine,
  dark,
}: {
  showLine: boolean;
  dark: boolean;
}) => {
  const [h, setH] = useState(Dimensions.get('window').height / 15);

  // Used to update red line position
  const [currentTime, setCurrentTime] = useState<Moment>(moment());
  const [mounted, setMounted] = useState<boolean>(true);
  const [updateTimeout, setUpdateTimeout] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      setMounted(false);
    };
  }, []);

  /**
   * Update time every 10 seconds, which will ensure red line is always in correct position
   */
  useEffect(() => {
    setTimeout(() => {
      mounted && setCurrentTime(moment());
    }, 10000);
  }, [currentTime, mounted]);

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 8 * p,
        paddingRight: 16 * p,
        paddingBottom: 16 * p,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}>
      {showLine ? (
        <View
          style={{
            zIndex: 300,
            height: 0,
            borderTopColor: colors.red,
            borderBottomColor: colors.red,
            backgroundColor: colors.red,
            borderTopWidth: 0.5 * p,
            borderBottomWidth: 0.5 * p,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            transform: [
              {
                translateY:
                  h +
                  (moment
                    .duration(
                      currentTime.diff(
                        moment().set({
                          h: 8,
                          m: 0,
                        }),
                      ),
                    )
                    .as('ms') /
                    (3600 * 1000)) *
                    h -
                  h / 2,
              },
            ],
          }}>
          <View
            style={{
              backgroundColor: colors.red,
              width: 8 * p,
              height: 8 * p,
              borderRadius: 16 * p,
            }}></View>
        </View>
      ) : null}
      {Array.from({length: 14}).map((_, index) => (
        <View
          key={index}
          style={{
            zIndex: 100,
            width: '100%',
            height: index == 0 ? h / 2 : h,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <Text
            s={8 * p}
            c={dark ? colors.gray200 : colors.gray700}
            w="r"
            style={{
              transform: [{translateY: 4 * p}],
            }}>
            {`${8 + index}:00`}
          </Text>
          <View
            style={{
              flex: 1,
              // width: '100%',
              borderBottomWidth: 0.5 * p,
              borderColor: dark ? colors.gray500 : colors.gray200,
              marginLeft: 4 * p,

              height: h,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default TimetableGrid;
