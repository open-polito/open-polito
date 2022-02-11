import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {STATUS, Status} from '../../store/status';
import {RootState} from '../../store/store';
import RecentItems from './../RecentItems';
import {TextS} from './../Text';
import WidgetBase from './WidgetBase';

export type MaterialWidgetProps = {
  action: Function;
  courseID: string;
};

const MaterialWidget: FC<MaterialWidgetProps> = ({
  action,
  courseID,
  ...props
}) => {
  const {t} = useTranslation();

  const loadCourseStatus = useSelector<RootState, Status | undefined>(
    state =>
      state.courses.courses.find(
        course => courseID == course.code + course.name,
      )?.loadCourseStatus,
  );

  return (
    <WidgetBase name={t('material')} action={action} compact {...props}>
      <View style={{flex: 1, width: '100%'}}>
        {loadCourseStatus?.code == STATUS.SUCCESS ? (
          <RecentItems compact relative_date courseID={courseID} />
        ) : (
          <TextS text={t('loading')} />
        )}
      </View>
    </WidgetBase>
  );
};

export default MaterialWidget;
