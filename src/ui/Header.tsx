import {useNavigation} from '@react-navigation/native';
import {Notification} from 'open-polito-api/lib/notifications';
import React, {FC, useCallback, useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import {AppDispatch, RootState} from '../store/store';
import BadgeContainer from './core/BadgeContainer';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';
import {DrawerActions} from '@react-navigation/native';
import {genericPlatform} from '../utils/platform';
import {setConfig} from '../store/sessionSlice';
import {Configuration} from '../defaultConfig';

// TODO navigation to downloads

export enum HEADER_TYPE {
  MAIN = 0,
  SECONDARY = 1,
}

export type HeaderParams = {
  title: string;
  headerType: HEADER_TYPE;
};

const Header: FC<HeaderParams> = ({title, headerType}) => {
  const {dark} = useContext(DeviceContext);
  const notifications = useSelector<RootState, Notification[]>(
    state => state.user.notifications,
  );
  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const dispatch = useDispatch<AppDispatch>();

  const notificationCount = useMemo<number>(() => {
    return notifications.filter(n => !n.is_read).length;
  }, [notifications]);

  const navigation = useNavigation();

  const themeToggleIconName = useMemo(
    () => (dark ? 'moon-stars' : 'sun'),
    [dark],
  );

  const toggleTheme = useCallback(() => {
    dispatch(setConfig({...config, theme: dark ? 'light' : 'dark'}));
  }, [dark, config, dispatch]);

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
  }, []);

  return (
    <View style={_styles.header}>
      {headerType === HEADER_TYPE.MAIN ? (
        <>
          <View style={_styles.headerSection}>
            {/* TODO add logic for badge number*/}
            <PressableBase
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}>
              <BadgeContainer number={0} style={{marginRight: 16 * p}}>
                <TablerIcon
                  name="menu-2"
                  size={24 * p}
                  color={dark ? colors.gray100 : colors.gray800}
                />
              </BadgeContainer>
            </PressableBase>
            {/* TODO download manager */}
            <PressableBase
              onPress={() => {
                navigation.navigate('Downloads');
              }}>
              <TablerIcon
                name="download"
                size={24 * p}
                color={dark ? colors.gray100 : colors.gray800}
              />
            </PressableBase>
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
            {genericPlatform !== 'mobile' && (
              <PressableBase onPress={toggleTheme}>
                <TablerIcon
                  name={themeToggleIconName}
                  size={24 * p}
                  color={dark ? colors.gray100 : colors.gray800}
                  style={{marginRight: 16 * p}}
                />
              </PressableBase>
            )}
            <PressableBase onPress={() => navigation.navigate('Search')}>
              <TablerIcon
                name="search"
                size={24 * p}
                color={dark ? colors.gray100 : colors.gray800}
                style={{marginRight: 16 * p}}
              />
            </PressableBase>
            <PressableBase onPress={() => navigation.navigate('Notifications')}>
              <BadgeContainer number={notificationCount}>
                <TablerIcon
                  name="bell"
                  size={24 * p}
                  color={dark ? colors.gray100 : colors.gray800}
                />
              </BadgeContainer>
            </PressableBase>
          </View>
        </>
      ) : headerType === HEADER_TYPE.SECONDARY ? (
        <>
          <PressableBase onPress={navigation.goBack}>
            <TablerIcon
              name="arrow-left"
              size={24 * p}
              color={dark ? colors.gray200 : colors.gray700}
            />
          </PressableBase>
          <Text
            s={16 * p}
            w="m"
            c={dark ? colors.gray100 : colors.gray800}
            style={{marginLeft: 16 * p}}>
            {title}
          </Text>
        </>
      ) : null}
    </View>
  );
};

export default Header;
