import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {ExamSession} from 'open-polito-api/lib/exam_sessions';
import colors from '../colors';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {ExamsState, getExams} from '../store/examsSlice';
import {STATUS} from '../store/status';
import {DeviceContext} from '../context/Device';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import Tabs from '../ui/Tabs';
import {p} from '../scaling';
import TablerIcon from '../ui/core/TablerIcon';
import Text from '../ui/core/Text';
import NoContent from '../ui/NoContent';
import ExamsBookExamModal from '../components/modals/ExamsBookExamModal';
import ExamsCancelExamModal from '../components/modals/ExamsCancelExamModal';
import {ModalContext} from '../context/ModalProvider';
import {getLanguageCode} from '../utils/l10n';

const isExamBooked = (examSession: ExamSession): boolean => {
  return examSession.user_is_signed_up;
};

const isExamAvailable = (examSession: ExamSession): boolean => {
  return !examSession.user_is_signed_up && examSession.error.id === 0;
};

const isExamUnavailable = (examSession: ExamSession): boolean => {
  return !examSession.user_is_signed_up && examSession.error.id !== 0;
};

const tabs = ['allExams', 'myBookings', 'availableToBook', 'unavailableExams'];

export default function ExamSessions() {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const {dark, device} = useContext(DeviceContext);
  const {setModal} = useContext(ModalContext);

  const {exams, getExamsStatus} = useSelector<RootState, ExamsState>(
    state => state.exams,
  );

  const [tab, setTab] = useState(tabs[0]);

  const [errorMsgLanguage, setErrorMsgLanguage] = useState('en');

  // Initial setup
  useEffect(() => {
    if (
      getExamsStatus.code === STATUS.IDLE ||
      getExamsStatus.code === STATUS.ERROR
    ) {
      dispatch(getExams(device));
    }
    (async () => {
      // Set language for error messages
      switch (getLanguageCode()) {
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
  }, [device, dispatch, getExamsStatus.code]);

  /**
   * Refresh exams
   */
  const refresh = useMemo(() => {
    if (getExamsStatus.code !== STATUS.PENDING) {
      dispatch(getExams(device));
    }
  }, [getExamsStatus, device, dispatch]);

  // If tab or exams change, re-filter the exam sessions based on the active tab
  const filteredSessions = useMemo(() => {
    switch (tab) {
      case tabs[0]:
        return exams;
      case tabs[1]:
        return exams.filter(e => isExamBooked(e));
      case tabs[2]:
        return exams.filter(e => isExamAvailable(e));
      case tabs[3]:
        return exams.filter(e => isExamUnavailable(e));
      default:
        return [];
    }
  }, [tab, exams]);

  const buildField = (type: string, e: ExamSession) => {
    const icon =
      type === 'date'
        ? 'calendar-time'
        : type === 'course'
        ? 'grid-pattern'
        : type === 'type'
        ? 'writing'
        : type === 'deadline'
        ? 'alert-triangle'
        : type === 'rooms'
        ? 'map-pin'
        : 'user-circle';
    const text =
      type === 'date'
        ? `${moment(e.date).format('lll')} (${moment(e.date).fromNow()})`
        : type === 'course'
        ? e.course_id
        : type === 'type'
        ? e.type
        : type === 'deadline'
        ? `${t('bookingDeadline')}: ${moment(e.signup_deadline).format(
            'lll',
          )} (${moment(e.signup_deadline).fromNow()})`
        : type === 'rooms'
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
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          padding: 16 * p,
          paddingRight: 8 * p,
          paddingBottom: 8 * p,
          borderTopLeftRadius: 4 * p,
          borderBottomLeftRadius: 4 * p,
          backgroundColor: dark ? colors.gray700 : colors.gray200,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TablerIcon
            name={
              examSession.user_is_signed_up
                ? 'circle-check'
                : examSession.error.id === 0
                ? 'circle'
                : 'circle-off'
            }
            color={
              examSession.user_is_signed_up
                ? colors.green
                : examSession.error.id === 0
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
        {examSession.error.id !== 0 &&
        (examSession.error.eng !== '' || examSession.error.ita !== '') ? (
          <Text s={10 * p} w="r" c={colors.red} style={{marginVertical: 8 * p}}>
            {errorMsgLanguage === 'it'
              ? examSession.error.ita
              : examSession.error.eng}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          borderTopRightRadius: 4 * p,
          borderBottomRightRadius: 4 * p,
          backgroundColor: dark ? colors.gray600 : colors.gray300,
        }}>
        {isExamAvailable(examSession) || isExamBooked(examSession) ? (
          <TouchableOpacity
            onPress={() =>
              setModal(
                isExamAvailable(examSession) ? (
                  <ExamsBookExamModal examSession={examSession} />
                ) : (
                  <ExamsCancelExamModal examSession={examSession} />
                ),
              )
            }>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                padding: 8 * p,
              }}>
              <View style={{marginBottom: 4 * p}}>
                <TablerIcon
                  name={
                    isExamAvailable(examSession) ? 'circle-plus' : 'circle-x'
                  }
                  color={
                    isExamAvailable(examSession) ? colors.accent300 : colors.red
                  }
                  size={20 * p}
                />
              </View>
              <Text
                s={10 * p}
                w="m"
                c={
                  isExamAvailable(examSession) ? colors.accent300 : colors.red
                }>
                {t(isExamAvailable(examSession) ? 'bookVerb' : 'cancel')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
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
