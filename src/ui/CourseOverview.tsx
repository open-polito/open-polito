import React, {FC, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {RootState} from '../store/store';
import {getRecentCourseMaterial} from '../utils/material';
import LiveWidget from '../components/widgets/LiveWidget';
import {CourseState} from '../store/coursesSlice';
import Section from './Section';
import TablerIcon from './core/TablerIcon';
import {p} from '../scaling';
import colors from '../colors';
import Text from './core/Text';
import {STATUS} from '../store/status';
import DirectoryItem from './DirectoryItem';
import Notification from './Notification';
import {NotificationType} from 'open-polito-api/lib/notifications';

// TODO "Exam is taken?" feature

const CourseOverview: FC<{
  code: string;
  changeTab: Function;
}> = ({code, changeTab}) => {
  const {t} = useTranslation();

  const {device, dark} = useContext(DeviceContext);

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == code,
    ),
  );

  const materialTree = courseData?.extendedInfo?.material || [];

  const buildField = (name: string, icon: string, index: number) => {
    return (
      <View
        key={icon}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: (index + 1) % 3 == 0 ? 0 : 8 * p,
        }}>
        <TablerIcon
          name={icon}
          size={16 * p}
          color={dark ? colors.gray200 : colors.gray700}
        />
        <Text
          s={10 * p}
          w="r"
          c={dark ? colors.gray200 : colors.gray700}
          style={{marginLeft: 8 * p}}>
          {name}
        </Text>
      </View>
    );
  };

  const fields = useMemo(() => {
    return [
      {
        name:
          courseData?.extendedInfo?.professor.surname +
          ' ' +
          courseData?.extendedInfo?.professor.name,
        icon: 'user-circle',
      },
      {
        name: courseData?.basicInfo.num_credits + ' ' + t('credits'),
        icon: 'north-star',
      },
      {
        name: courseData?.basicInfo.code,
        icon: 'grid-pattern',
      },
      {
        name:
          t('year') +
            ' ' +
            (courseData?.extendedInfo?.degree_year || '') +
            ', ' +
            t('period') +
            ' ' +
            courseData?.extendedInfo?.year_period || '',
        icon: 'calendar-time',
      },
      // {
      //   name: '(feature coming soon)',
      //   icon: 'writing',
      // },
    ];
  }, [courseData]);

  return (
    <View>
      {/* Summary */}
      <Section dark={dark} title={t('summary')}>
        {courseData?.status.code == STATUS.PENDING ? (
          <ActivityIndicator />
        ) : (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              {fields
                .slice(0, 2)
                .map((field, i) => buildField(field.name || '', field.icon, i))}
            </View>
            <View style={{flex: 1}}>
              {fields
                .slice(2)
                .map((field, i) => buildField(field.name || '', field.icon, i))}
            </View>
          </View>
        )}
      </Section>
      {courseData?.extendedInfo?.live_lessons.map(liveClass => (
        <LiveWidget
          key={liveClass.meeting_id}
          liveClass={liveClass}
          courseName={courseData.basicInfo.name}
          device={device}
        />
      )) || null}
      {/* Latest files */}
      <Section dark={dark} title={t('latestFiles')} style={{marginTop: 24}}>
        <View style={{marginTop: -8}}>
          {courseData?.status.code == STATUS.PENDING ? (
            <ActivityIndicator />
          ) : (
            getRecentCourseMaterial(materialTree || []).map(file => (
              <DirectoryItem item={file} dark={dark} />
            ))
          )}
        </View>
      </Section>
      {/* Latest alert */}
      <Section dark={dark} title={t('latestAlert')} style={{marginTop: 16}}>
        {courseData?.status.code == STATUS.PENDING ? (
          <ActivityIndicator />
        ) : (courseData?.extendedInfo?.notices || []).length > 0 ? (
          <Notification
            notification={{
              ...courseData?.extendedInfo?.notices[0]!,
              course_code: courseData?.basicInfo.code || '',
              course_name: courseData?.basicInfo.name || '',
            }}
            type={NotificationType.NOTICE}
            dark={dark}
          />
        ) : null}
      </Section>
    </View>
  );
};

export default CourseOverview;
