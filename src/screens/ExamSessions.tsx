import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {ExamsState, getExams} from '../store/examsSlice';
import {STATUS} from '../store/status';
import {DeviceContext} from '../context/Device';
import NoContent from '../components/NoContent';

export default function ExamSessions({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const deviceContext = useContext(DeviceContext);

  const examsState = useSelector<RootState, ExamsState>(state => state.exams);
  const [filteredSessions, setFilteredSessions] = useState<ExamSession[]>([]);

  const [offsetY, setOffsetY] = useState(0);

  const [tab, setTab] = useState('all');

  const [errorMsgLanguage, setErrorMsgLanguage] = useState('en');

  // Initial setup
  useEffect(() => {
    if (examsState.getExamsStatus.code != STATUS.PENDING) {
      dispatch(getExams(deviceContext.device));
    }
    (async () => {
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

  // If tab or exams change, re-filter the exam sessions based on the active tab
  useEffect(() => {
    if (tab == 'all') {
      setFilteredSessions(examsState.exams);
    } else if (tab == 'booked') {
      setFilteredSessions(
        examsState.exams.filter(session => session.user_is_signed_up),
      );
    } else if (tab == 'available') {
      setFilteredSessions(
        examsState.exams.filter(
          session => !session.user_is_signed_up && session.error.id == 0,
        ),
      );
    }
  }, [tab, examsState.exams]);

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
        ...styles.border,
        backgroundColor: colors.white,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
      <View style={{marginRight: 8}}>
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
          justifyContent: 'flex-start',
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
            paddingVertical: 4,
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
          {filteredSessions.length > 0 ? (
            filteredSessions.map(examSession =>
              tab == 'available'
                ? !examSession.user_is_signed_up &&
                  !examSession.error_msg &&
                  examSessionCard(examSession)
                : examSessionCard(examSession),
            )
          ) : (
            <NoContent />
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
