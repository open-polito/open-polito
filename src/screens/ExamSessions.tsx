import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {UserContext} from '../context/User';
import styles from '../styles';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {ExamSession, getExamSessions} from 'open-polito-api/exam_sessions';
import {TextN, TextS, TextXS} from '../components/Text';
import colors from '../colors';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HorizontalSelector from '../components/HorizontalSelector';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';

export default function ExamSessions({navigation}) {
  const {t} = useTranslation();

  const {user} = useContext(UserContext);

  const [examSessions, setExamSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);

  const [offsetY, setOffsetY] = useState(0);

  const [tab, setTab] = useState('all');

  const [errorMsgLanguage, setErrorMsgLanguage] = useState('en');

  // Initial fetch
  useEffect(() => {
    (async () => {
      const data = await getExamSessions(user.device);
      data.sort((a, b) => a.date - b.date);
      setExamSessions(data);

      // Set language for error messages
      switch (RNLocalize.getLocales()[0].languageCode) {
        case 'en':
          setErrorMsgLanguage('en');
          break;
        case 'it':
          setErrorMsgLanguage('it');
          break;
        default:
          setErrorMsgLanguage('en');
          break;
      }
    })();
  }, []);

  // If tab or examSessions change, re-filter the exam sessions based on the active tab
  useEffect(() => {
    if (tab == 'all') {
      setFilteredSessions(examSessions);
    } else if (tab == 'booked') {
    } else if (tab == 'available') {
      setFilteredSessions(
        examSessions.filter(
          session => !session.user_is_signed_up && session.error.id == 0,
        ),
      );
    }
  }, [tab, examSessions]);

  const tabs = [
    {
      icon: '',
      label: t('allExams'),
      value: 'all',
    },
    {
      icon: 'check-circle',
      label: t('booked'),
      value: 'booked',
    },
    {
      icon: 'circle-outline',
      label: t('availableToBook'),
      value: 'available',
    },
  ];

  const buildFields = (item: ExamSession) => {
    return [
      {
        value:
          moment(item.date).format('lll') + ` (${moment(item.date).fromNow()})`,
        icon: 'calendar',
      },
      {
        value: item.type,
        icon: 'text',
      },
      {
        value:
          JSON.stringify(item.rooms) != JSON.stringify([' ']) // API returns [" "] when there are no rooms listed
            ? item.rooms.join('\n')
            : 'unknown',
        icon: 'place',
      },
    ];
  };

  const examSessionCard = (examSession: ExamSession) => (
    <View
      key={examSession.session_id}
      style={{
        ...styles.elevatedSmooth,
        backgroundColor: colors.white,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        flexDirection: 'row',
      }}>
      <View style={{marginRight: 8, flexShrink: 0}}>
        <IconC
          name={
            examSession.user_is_signed_up
              ? 'check-circle'
              : examSession.error.id != 0
              ? 'close-circle'
              : 'circle-outline'
          }
          color={
            examSession.user_is_signed_up
              ? colors.green
              : examSession.error.id != 0
              ? colors.red
              : colors.gradient1
          }
          size={32}
        />
      </View>
      <View
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
        <TextN numberOfLines={1} weight="medium" text={examSession.exam_name} />

        <TextN
          text={examSession.course_id}
          color={colors.gray}
          weight="medium"
        />
        <View style={{marginBottom: 8}}></View>
        {buildFields(examSession).map(field => (
          <View key={field.icon} style={{flexDirection: 'row', flex: 1}}>
            {['place'].includes(field.icon) ? (
              <Icon
                style={{marginRight: 4}}
                name={field.icon}
                size={16}
                color={colors.gray}
              />
            ) : (
              <IconC
                style={{marginRight: 4}}
                name={field.icon}
                size={16}
                color={colors.gray}
              />
            )}
            <TextS text={field.value} />
          </View>
        ))}
        <View style={{marginBottom: 8}}></View>
        <TextS
          text={
            t('deadline') +
            ': ' +
            moment(examSession.signup_deadline).format('lll')
          }
          style={{
            borderRadius: 4,
            padding: 4,
          }}
        />
        {!examSession.user_is_signed_up && examSession.error.id != 0 && (
          <TextXS
            style={{
              marginTop: 8,
            }}
            weight="bold"
            color={colors.red}
            text={
              errorMsgLanguage == 'it'
                ? examSession.error.ita
                : examSession.error.eng
            }
          />
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('examSessions')} backFunc={navigation.goBack} />
      </View>

      <View
        style={{
          ...styles.paddingFromHeader,
          flex: 1,
        }}>
        <View>
          <HorizontalSelector items={tabs} onValueChange={setTab} />
        </View>
        <ScrollView
          onScroll={e => {
            setOffsetY(e.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: offsetY == 0 ? 32 : 16,
            ...styles.withHorizontalPadding,
          }}>
          {filteredSessions.map(examSession =>
            tab == 'available'
              ? !examSession.user_is_signed_up &&
                !examSession.error_msg &&
                examSessionCard(examSession)
              : examSessionCard(examSession),
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
