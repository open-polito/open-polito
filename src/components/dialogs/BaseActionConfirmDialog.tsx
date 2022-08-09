import React, {ReactNode, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import colors, {Color} from '../../colors';
import {DeviceContext} from '../../context/Device';
import {p} from '../../scaling';
import {setDialog} from '../../store/sessionSlice';
import {AppDispatch} from '../../store/store';
import Button from '../../ui/core/Button';
import TablerIcon from '../../ui/core/TablerIcon';
import Text from '../../ui/core/Text';

const BaseActionConfirmDialog = ({
  title,
  icon = '',
  accentColor = colors.accent300,
  children,
  onConfirm,
}: {
  title: string;
  icon?: string;
  accentColor?: Color;
  children: ReactNode;
  onConfirm: () => any;
}) => {
  const {dark} = useContext(DeviceContext);
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const closeDialog = () => {
    dispatch(setDialog({visible: false, params: null}));
  };

  return (
    <View style={{paddingHorizontal: 16 * p}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {icon ? (
          <View style={{marginRight: 8 * p}}>
            <TablerIcon name={icon} color={accentColor} size={24 * p} />
          </View>
        ) : null}
        <Text s={16} w="m" c={dark ? colors.gray100 : colors.gray800}>
          {title}
        </Text>
      </View>
      <View style={{marginTop: 24 * p}}>{children}</View>
      <View style={{marginTop: 24 * p, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Button secondary text={t('cancel')} onPress={closeDialog} />
        </View>
        <View style={{width: 16 * p}}></View>
        <View style={{flex: 1}}>
          <Button
            color={accentColor}
            text={t('confirm')}
            onPress={() => {
              onConfirm();
              closeDialog();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default BaseActionConfirmDialog;
