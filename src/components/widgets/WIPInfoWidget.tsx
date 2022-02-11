import React from 'react';
import {useTranslation} from 'react-i18next';
import InfoWidget from './InfoWidget';

/**
 * Component to show in screens marked as "Work in progress"
 */
const WIPInfoWidget = () => {
  const {t} = useTranslation();

  return (
    <InfoWidget
      title={t('wipInfoWidgetTitle')}
      description={t('wipInfoWidgetDesc')}
      icon="build-outline"
      color="yellow"
    />
  );
};

export default WIPInfoWidget;
