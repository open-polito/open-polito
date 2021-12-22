import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../colors';
import styles from '../styles';
import AnimatedLiveCircle from './AnimatedLiveCircle';
import {TextN, TextS, TextXS} from './Text';
import WidgetBase from './WidgetBase';

export default function LiveWidget({liveClass, courseName, device}) {
  const [mounted, setMounted] = useState(true);
  const [time, setTime] = useState(0);

  const calculateTime = () => {
    return moment
      .utc(moment(Date.now()).diff(moment(liveClass.date)))
      .format('HH:mm:ss');
  };

  const gotoLiveClass = () => {
    (async () => {
      await liveClass.populate(device);
      await Linking.openURL(liveClass.url);
    })();
  };

  useEffect(() => {
    (async () => {
      setTimeout(() => {
        mounted && setTime(calculateTime());
      }, 1000);
    })();
    return () => {
      setMounted(false);
    };
  }, [time]);

  return (
    <WidgetBase withButton={false} withPadding={false} action={gotoLiveClass}>
      <LinearGradient
        start={{x: 0.2, y: 0.1}}
        end={{x: 0.7, y: 0.9}}
        colors={['#EA0000', '#C30000']}
        style={{
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 24,
          ...styles.elevatedSmooth,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.red,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: -styles.withHorizontalPadding.paddingHorizontal / 2,
          }}>
          <View style={{marginRight: 8}}>
            <AnimatedLiveCircle width={40}></AnimatedLiveCircle>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
            <TextN color={colors.white} weight="bold" text="LIVE" />
            <TextN color={colors.white} weight="bold" text={calculateTime()} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <TextS
            numberOfLines={1}
            color={colors.white}
            weight="bold"
            text={liveClass.title}
          />
          <TextXS
            numberOfLines={1}
            color={colors.white}
            weight="medium"
            text={courseName}
          />
        </View>
      </LinearGradient>
    </WidgetBase>
  );
}
