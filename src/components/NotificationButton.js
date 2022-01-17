import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notImplemented from '../utils/notImplemented';
import {useTranslation} from 'react-i18next';

export default function NotificationButton({color = colors.black}) {
  const {t} = useTranslation();
  return (
    <View style={{elevation: 3}}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        // TODO onPress go to category
        // onPress={onPress}
        onPress={() => {
          notImplemented(t);
        }}>
        <Icon name="bell-outline" size={40} color={color} />
      </Pressable>
    </View>
  );
}

const _styles = StyleSheet.create({
  btn: {
    elevation: 3,
  },
});
