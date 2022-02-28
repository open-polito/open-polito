import moment from 'moment';
import React, {useState} from 'react';
import {Dimensions, View} from 'react-native';
import colors from '../../colors';
import {TextXS} from '../Text';

const TimetableGrid = () => {
  const [h, setH] = useState(Dimensions.get('window').height / 15);

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 8,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}>
      <View
        style={{
          zIndex: 300,
          height: 0,
          borderTopColor: colors.red,
          borderBottomColor: colors.red,
          backgroundColor: colors.red,
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          transform: [
            {
              translateY:
                h +
                (moment
                  .duration(
                    moment().diff(
                      moment().set({
                        h: 8,
                        m: 0,
                      }),
                    ),
                  )
                  .as('ms') /
                  (3600 * 1000)) *
                  h,
            },
          ],
        }}>
        <View
          style={{
            backgroundColor: colors.red,
            width: 8,
            height: 8,
            borderRadius: 16,
          }}></View>
      </View>
      {Array.from({length: 14}).map((_, index) => (
        <View
          style={{
            zIndex: 100,
            width: '100%',
            height: index == 0 ? h / 2 : h,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <TextXS text={`${8 + index}:00`} />
          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderColor: colors.lightGray,
              height: h,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}></View>
        </View>
      ))}
    </View>
  );
};

export default TimetableGrid;
