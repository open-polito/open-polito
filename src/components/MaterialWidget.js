import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import RecentItems from './RecentItems';
import {TextS} from './Text';
import WidgetBase from './WidgetBase';

export default function MaterialWidget({action, courseCode}) {
  const {t} = useTranslation();

  const material = useSelector(state => state.material.material);

  return (
    <WidgetBase name={t('material')} action={action} compact>
      {material ? (
        <RecentItems compact relative_date course={courseCode} />
      ) : (
        <TextS text={t('loading')} />
      )}
    </WidgetBase>
  );
}
