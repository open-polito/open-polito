import React, {FC} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WidgetBase from './WidgetBase';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../styles';
import colors from '../../colors';
import {TextN, TextXS} from '../Text';

export type InfoWidgetProps = {
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'red' | 'yellow';
};

const gradients = {
  green: ['#28BC2E', '#1E971B'],
  red: ['#EA0000', '#C30000'],
  yellow: ['#FFA621', '#FF9900'],
};

const sideColors = {
  green: '#009320',
  red: '#A70A00',
  yellow: '#FF7A00',
};

const InfoWidget: FC<InfoWidgetProps> = ({title, description, icon, color}) => {
  return (
    <WidgetBase withButton={false} withPadding={false} fullHeight={true}>
      <LinearGradient
        start={{x: 0.2, y: 0.1}}
        end={{x: 0.7, y: 0.9}}
        colors={gradients[color]}
        style={{
          borderRadius: 16,
          ...styles.elevatedSmooth,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: sideColors[color],
          }}
        />
        <View
          style={{
            flex: 19,
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} color={colors.white} size={32} />
          <View
            style={{
              marginLeft: 24,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <TextN
              text={title.toUpperCase()}
              color={colors.white}
              weight="bold"
            />
            <TextXS text={description} color={colors.white} />
          </View>
        </View>
      </LinearGradient>
    </WidgetBase>
  );
};

export default InfoWidget;
