import {Notice} from 'open-polito-api/lib/course';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import colors from '../../colors';
import Text from '../../ui/core/Text';
import CourseAlert from '../CourseAlert';
import WidgetBase, {WidgetBaseProps} from './WidgetBase';

export type AlertWidgetProps = {
  action: Function;
  alerts: Notice[];
  dark?: boolean;
} & WidgetBaseProps;

const AlertWidget: FC<AlertWidgetProps> = ({
  action,
  dark,
  alerts,
  ...props
}) => {
  const {t} = useTranslation();

  return (
    <WidgetBase name={t('alerts')} action={action} compact {...props}>
      {alerts ? (
        <View style={{flexDirection: 'column', marginTop: 8}}>
          {alerts.map(alert => (
            <CourseAlert
              dark={dark}
              compact
              alert={alert}
              key={alert.date.toString() + alert.text.slice(0, 30)}
            />
          ))}
        </View>
      ) : (
        <Text s={12 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
          {t('loading')}
        </Text>
      )}
    </WidgetBase>
  );
};

export default AlertWidget;
