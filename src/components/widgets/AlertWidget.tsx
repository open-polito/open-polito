import {Notice} from 'open-polito-api/course';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import CourseAlert from './../CourseAlert';
import {TextS} from './../Text';
import WidgetBase, {WidgetBaseProps} from './../widgets/WidgetBase';

export type AlertWidgetProps = {
  action: Function;
  alerts: Notice[];
} & WidgetBaseProps;

const AlertWidget: FC<AlertWidgetProps> = ({action, alerts, ...props}) => {
  const {t} = useTranslation();

  return (
    <WidgetBase name={t('alerts')} action={action} compact {...props}>
      {alerts ? (
        <View style={{flexDirection: 'column', marginTop: 8}}>
          {alerts.map(alert => (
            <CourseAlert
              compact
              alert={alert}
              key={alert.date.toString() + alert.text.slice(0, 30)}
            />
          ))}
        </View>
      ) : (
        <TextS text={t('loading')} />
      )}
    </WidgetBase>
  );
};

export default AlertWidget;
