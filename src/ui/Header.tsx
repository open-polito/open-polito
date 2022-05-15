import {useNavigation} from '@react-navigation/native';
import {Notification} from 'open-polito-api/notifications';
import React, {FC, useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import {RootState} from '../store/store';
import BadgeContainer from './core/BadgeContainer';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

// TODO navigation to drawer, search bar, notifications, downloads

export type HeaderParams = {
  title: string;
};

const Header: FC<HeaderParams> = ({title}) => {
  const {dark} = useContext(DeviceContext);
  const notifications = useSelector<RootState, Notification[]>(
    state => state.user.notifications,
  );
  const notificationCount = useMemo<number>(() => {
    return notifications.filter(n => !n.is_read).length;
  }, [notifications]);

  const navigation = useNavigation();

  // TODO drawer notification count

  const _styles = useMemo(() => {
    return StyleSheet.create({
      header: {
        flexDirection: 'row',
        marginHorizontal: 12 * p,
        marginVertical: 16 * p,
        alignItems: 'center',
      },
      headerSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      headerMiddle: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
      },
      headerEnd: {
        justifyContent: 'flex-end',
      },
    });
  }, [dark]);

  return (
    <View style={_styles.header}>
      <View style={_styles.headerSection}>
        {/* TODO add logic for badge number*/}
        <PressableBase
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <BadgeContainer number={0} style={{marginRight: 16 * p}}>
            <TablerIcon
              name="menu-2"
              size={24 * p}
              color={dark ? colors.gray100 : colors.gray800}
            />
          </BadgeContainer>
        </PressableBase>
        <TablerIcon
          name="download"
          size={24 * p}
          color={dark ? colors.gray100 : colors.gray800}
        />
      </View>
      <View
        style={{
          ..._styles.headerSection,
          ..._styles.headerMiddle,
        }}>
        <Text
          c={dark ? colors.gray100 : colors.gray800}
          w="m"
          s={16 * p}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={{..._styles.headerSection, ..._styles.headerEnd}}>
        <TablerIcon
          name="search"
          size={24 * p}
          color={dark ? colors.gray100 : colors.gray800}
          style={{marginRight: 16 * p}}
        />
        {/* TODO add logic for badge number*/}
        <BadgeContainer number={notificationCount}>
          <TablerIcon
            name="bell"
            size={24 * p}
            color={dark ? colors.gray100 : colors.gray800}
          />
        </BadgeContainer>
      </View>
    </View>
  );
};

export default Header;
