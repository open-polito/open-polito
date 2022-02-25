import React, {ReactNode, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {TextN} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TextWidget = ({
  icon = '',
  name,
  action = () => {},
  expandable = false,
  children,
}: {
  icon?: string;
  name: string;
  action?: Function;
  expandable?: boolean;
  children?: ReactNode;
}) => {
  const {t} = useTranslation();

  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={{
        ...styles.elevatedSmooth,
        ...styles.border,
        backgroundColor: colors.white,
        marginBottom: 16,
      }}>
      <Pressable
        style={{paddingHorizontal: 12, paddingVertical: 8}}
        android_ripple={{color: colors.lightGray}}
        onPress={() => {
          expandable
            ? () => {
                setExpanded(!expanded);
              }
            : action;
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 4,
          }}>
          {icon && (
            <Icon
              name={icon}
              color={expanded ? colors.gradient1 : colors.mediumGray}
              size={24}
            />
          )}
          <TextN style={{marginLeft: 8}} text={name} weight="medium" />
          <Icon
            name={expanded ? 'chevron-down' : 'chevron-right'}
            color={colors.mediumGray}
            size={24}
            style={{position: 'absolute', right: 0}}
          />
        </View>
      </Pressable>
      {expanded && children ? (
        <View style={{paddingHorizontal: 16, paddingBottom: 8}}>
          {children}
        </View>
      ) : null}
    </View>
  );
};

export default TextWidget;
