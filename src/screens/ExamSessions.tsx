import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {ExamSession} from 'open-polito-api/exam_sessions';
import colors from '../colors';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {ExamsState, getExams} from '../store/examsSlice';
import {STATUS} from '../store/status';
import {DeviceContext} from '../context/Device';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import Tabs from '../ui/Tabs';
import {p} from '../scaling';
import TablerIcon from '../ui/core/TablerIcon';
import Text from '../ui/core/Text';
import NoContent from '../components/NoContent';

// TODO book exams

const tabs = ['allExams', 'myBookings', 'availableToBook', 'unavailableExams'];

export default function ExamSessions({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {dark, device} = useContext(DeviceContext);

  const {exams, getExamsStatus} = useSelector<RootState, ExamsState>(
    state => state.exams,
  );

  const [tab, setTab] = useState(tabs[0]);

  const [errorMsgLanguage, setErrorMsgLanguage] = useState('en');

  // Initial setup
  useEffect(() => {
    if (
      getExamsStatus.code == STATUS.IDLE ||
      getExamsStatus.code == STATUS.ERROR
    ) {
      dispatch(getExams(device));
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

  /**
   * Refresh exams
   */
  const refresh = () => {
    if (getExamsStatus.code != STATUS.PENDING) dispatch(getExams(device));
  };

  // If tab or exams change, re-filter the exam sessions based on the active tab
  const filteredSessions = useMemo(() => {
    switch (tab) {
      case tabs[0]:
        return exams;
      case tabs[1]:
        return exams.filter(e => e.user_is_signed_up);
      case tabs[2]:
        return exams.filter(e => !e.user_is_signed_up && e.error.id == 0);
      case tabs[3]:
        return exams.filter(e => !e.user_is_signed_up && e.error.id != 0);
      default:
        return [];
    }
  }, [tab, exams, getExamsStatus]);

  const buildField = (type: string, e: ExamSession) => {
    const icon =
      type == 'date'
        ? 'calendar-time'
        : type == 'course'
        ? 'grid-pattern'
        : type == 'type'
        ? 'writing'
        : type == 'deadline'
        ? 'alert-triangle'
        : type == 'rooms'
        ? 'map-pin'
        : 'user-circle';
    const text =
      type == 'date'
        ? `${moment(e.date).format('lll')} (${moment(e.date).fromNow()})`
        : type == 'course'
        ? e.course_id
        : type == 'type'
        ? e.type
        : type == 'deadline'
        ? `${t('bookingDeadline')}: ${moment(e.signup_deadline).format(
            'lll',
          )} (${moment(e.signup_deadline).fromNow()})`
        : type == 'rooms'
        ? e.rooms.join(', ')
        : '(coming soon)';
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8 * p,
        }}>
        <TablerIcon
          name={icon}
          size={16 * p}
          color={dark ? colors.gray200 : colors.gray700}
          style={{marginRight: 8 * p}}
        />
        <Text
          numberOfLines={1}
          style={{marginRight: 8 * p}}
          s={10 * p}
          w="r"
          c={dark ? colors.gray200 : colors.gray700}>
          {text}
        </Text>
      </View>
    );
  };

  const examSessionCard = (examSession: ExamSession) => (
    <View
      style={{
        flexDirection: 'column',
        padding: 16 * p,
        paddingRight: 8 * p,
        paddingBottom: 8 * p,
        borderRadius: 4 * p,
        backgroundColor: dark ? colors.gray700 : colors.gray200,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TablerIcon
          name={
            examSession.user_is_signed_up
              ? 'circle-check'
              : examSession.error.id == 0
              ? 'circle'
              : 'circle-off'
          }
          color={
            examSession.user_is_signed_up
              ? colors.green
              : examSession.error.id == 0
              ? colors.accent200
              : colors.red
          }
          size={24 * p}
          style={{marginRight: 8 * p}}
        />
        <Text s={12 * p} w="m" c={dark ? colors.gray200 : colors.gray700}>
          {examSession.exam_name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 16 * p,
        }}>
        {['course', 'date', 'deadline', 'rooms'].map(field =>
          buildField(field, examSession),
        )}
      </View>
      {examSession.error.id != 0 &&
      (examSession.error.eng != '' || examSession.error.ita != '') ? (
        <Text s={10 * p} w="r" c={colors.red} style={{marginVertical: 8 * p}}>
          {errorMsgLanguage == 'it'
            ? examSession.error.ita
            : examSession.error.eng}
        </Text>
      ) : null}
    </View>
  );

  return (
    <Screen>
      <Header title={t('examSessions')} headerType={HEADER_TYPE.MAIN} />
      <Tabs
        dark={dark}
        adjusted
        items={tabs.map(tab => {
          return {label: t(tab), value: tab};
        })}
        onChange={idx => setTab(tabs[idx])}
      />
      <FlatList
        contentContainerStyle={{
          paddingTop: 24 * p,
          paddingHorizontal: 16 * p,
          paddingBottom: 24 * p,
        }}
        data={filteredSessions}
        keyExtractor={item => item.session_id + item.course_id + item.date}
        renderItem={({item}) => examSessionCard(item)}
        ItemSeparatorComponent={() => <View style={{height: 16 * p}} />}
        ListEmptyComponent={<NoContent />}
        refreshing={getExamsStatus.code == STATUS.PENDING}
        refreshControl={
          <RefreshControl
            refreshing={getExamsStatus.code == STATUS.PENDING}
            onRefresh={refresh}
          />
        }
      />
    </Screen>
  );
}
