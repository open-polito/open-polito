import {useNavigation} from '@react-navigation/native';
import {
  CoursesInfo,
  PermanentMark,
  ProvisionalMark,
} from 'open-polito-api/courses';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextN, TextS} from '../components/Text';
import {RootState} from '../store/store';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const Exams = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const permanent = useSelector<RootState, PermanentMark[]>(
    state => state.courses.marks.permanent,
  );

  const provisional = useSelector<RootState, ProvisionalMark[]>(
    state => state.courses.marks.provisional,
  );

  const buildProvisionalMarkFields = (item: ProvisionalMark) => {
    return [
      {
        icon: 'calendar',
        value: moment(item).format('ll'),
      },
    ];
  };

  const buildPermanentMarkFields = (item: PermanentMark) => {
    return [{icon: 'calendar', value: moment(item.date).format('ll')}];
  };

  return (
    <ScreenContainer>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('exams')} backFunc={navigation.goBack} />
      </View>
      <View
        style={{...styles.paddingFromHeader, ...styles.withHorizontalPadding}}>
        {permanent.map(mark => (
          <View
            style={{
              ...styles.border,
              ...styles.elevatedSmooth,
              padding: 16,
              backgroundColor: colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 3}}>
              <TextN text={mark.name} />
              {buildPermanentMarkFields(mark).map(field => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons name={field.icon} />
                  <TextS text={field.value} />
                </View>
              ))}
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TextL text={mark.mark} />
              <TextS text={mark.num_credits + ' CFU'} />
            </View>
          </View>
        ))}
        {provisional.map(mark => (
          <View
            style={{
              ...styles.border,
              ...styles.elevatedSmooth,
              padding: 16,
              backgroundColor: colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 3}}>
              <TextN text={mark.name} />
              {buildProvisionalMarkFields(mark).map(field => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons name={field.icon} />
                  <TextS text={field.value} />
                </View>
              ))}
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TextL text={mark.mark} />
              <TextS text={mark.num_credits + ' CFU'} />
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
};

export default Exams;
