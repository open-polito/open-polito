import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function NotificationButton({color = colors.black}) {
  return (
    <View style={{elevation: 3}}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        // TODO onPress go to category
        // onPress={onPress}
        onPress={() => console.log('pressed!')}>
        <Icon name="notifications-active" size={40} color={color} />
      </Pressable>
    </View>
  );
}

const _styles = StyleSheet.create({
  btn: {
    elevation: 3,
  },
});
