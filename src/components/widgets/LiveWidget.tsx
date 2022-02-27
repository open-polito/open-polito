import moment from 'moment';
import {getLessonURL, LiveLesson} from 'open-polito-api/course';
import {Device} from 'open-polito-api/device';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Linking, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../colors';
import styles from '../../styles';
import AnimatedLiveCircle from './../AnimatedLiveCircle';
import {TextN, TextS, TextXS} from './../Text';
import WidgetBase from './WidgetBase';

export type LiveWidgetProps = {
  liveClass: LiveLesson;
  courseName: string;
  device: Device;
};

const LiveWidget: FC<LiveWidgetProps> = ({liveClass, courseName, device}) => {
  const [mounted, setMounted] = useState<boolean>(true);
  const [time, setTime] = useState<number | string>(0);
  let intervalID = useRef<any>();

  const calculateTime = () => {
    return moment
      .utc(moment(Date.now()).diff(moment(liveClass.date)))
      .format('HH:mm:ss');
  };

  const gotoLiveClass = () => {
    (async () => {
      await Linking.openURL((await getLessonURL(device, liveClass)).url || '');
    })();
  };

  useEffect(() => {
    (async () => {
      intervalID.current = setInterval(() => {
        mounted && setTime(calculateTime());
      }, 1000);
    })();
    return () => {
      clearInterval(intervalID.current);
      setMounted(false);
    };
  }, []);

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
};

export default LiveWidget;
