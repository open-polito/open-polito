import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React, {FC, useContext, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../colors';
import Text from './core/Text';
import {p} from '../scaling';
import PressableBase from './core/PressableBase';
import version from '../../../../version.json';
import sections from '../sections';
import {useTranslation} from 'react-i18next';
import TablerIcon from './core/TablerIcon';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {PersonalData} from 'open-polito-api/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../store/sessionSlice';
import {Device} from 'open-polito-api/lib/device';
import {DeviceContext} from '../context/Device';
import Logger from '../utils/Logger';

// TODO remove when sections completed
const isSectionUnavailable = (name: string) => {
  return ['Maps', 'Classrooms', 'People'].includes(name);
};

type DrawerParams = {
  dark: boolean;
} & DrawerContentComponentProps;

// TODO proper separation of logic
// TODO badges

const orderedSections = sections.flatMap(sec => sec.items.map(i => i.name));

const getShortenedDegreeName = (degreeType: string, degreeName: string) => {
  const prefix =
    degreeType.toLowerCase() == 'corso di laurea in'
      ? 'L3'
      : degreeType.toLowerCase() == 'corso di laurea magistrale in'
      ? 'LM'
      : '';
  const suffix = degreeName
    .toLowerCase()
    .replace('ingegneria', '')
    .toUpperCase()
    .trim();
  return `${prefix} ${suffix}`;
};

// TODO fix bug where highlighted selection doesn't update if pressing back button

const Drawer: FC<DrawerParams> = ({dark, ...props}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const deviceContext = useContext(DeviceContext);

  const userInfo = useSelector<RootState, PersonalData | null>(
    state => state.user.userInfo,
  );

  const shortDegreeName = useMemo(() => {
    if (userInfo == null) {
      return '';
    }
    return getShortenedDegreeName(userInfo.degree_type, userInfo.degree_name);
  }, [userInfo]);

  const [current, setCurrent] = useState(orderedSections[0]);

  // TODO optimize (maybe with useMemo)
  const createButtons = () => {
    return sections.map(sec => (
      <View style={_styles.category}>
        <View style={{marginBottom: 8 * p}}>
          <Text s={10 * p} w="m" c={dark ? colors.gray200 : colors.gray700}>
            {t(sec.name).toUpperCase()}
          </Text>
        </View>
        {sec.items.map(screen => (
          <PressableBase
            disabled={isSectionUnavailable(screen.name)}
            style={{
              paddingVertical: 4 * p,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: isSectionUnavailable(screen.name) ? 0.3 : 1,
            }}
            key={screen.name}
            onPress={() => {
              setCurrent(screen.name);
              props.navigation.navigate(screen.name);
            }}>
            <TablerIcon
              name={screen.icon}
              size={24 * p}
              color={
                screen.name == current
                  ? colors.accent300
                  : dark
                  ? colors.gray100
                  : colors.gray700
              }
              style={{marginRight: 8 * p}}
            />
            <Text
              s={12 * p}
              w="m"
              c={
                screen.name == current
                  ? colors.accent300
                  : dark
                  ? colors.gray100
                  : colors.gray800
              }>
              {t(screen.name.charAt(0).toLowerCase() + screen.name.slice(1))}
            </Text>
          </PressableBase>
        ))}
      </View>
    ));
  };

  // Copied from legacy settings screen
  // TODO separation of logic
  const handleLogout = () => {
    (async () => {
      try {
        await AsyncStorage.multiRemove(['@config']);
      } catch (e) {}
      // We create another Device because we need to reset current device from context
      dispatch(
        logout(
          new Device(
            deviceContext.device.uuid,
            10000,
            (await Logger.isLoggingEnabled())
              ? Logger.logRequestSync
              : () => {},
          ),
        ),
      );
      // Reset context device
      deviceContext.setDevice(new Device(''));
    })();
  };

  const _styles = useMemo(() => {
    return StyleSheet.create({
      drawerScrollView: {
        backgroundColor: dark ? colors.gray800 : colors.gray100,
      },
      drawer: {
        flexDirection: 'column',
        paddingHorizontal: 16 * p,
        paddingVertical: 24 * p,
      },
      hr: {
        backgroundColor: colors.gray500,
        height: 1 * p,
        marginBottom: 16 * p,
      },
      category: {
        marginBottom: 16 * p,
      },
    });
  }, [dark]);

  return (
    <DrawerContentScrollView style={_styles.drawerScrollView} {...props}>
      <View style={_styles.drawer}>
        <View style={{justifyContent: 'flex-start', marginBottom: 16 * p}}>
          <Text s={14 * p} w="b" c={dark ? colors.gray100 : colors.gray800}>
            Open PoliTo
          </Text>
          <Text s={10 * p} w="r" c={dark ? colors.gray200 : colors.gray700}>
            v{version.version}
          </Text>
        </View>
        <View style={_styles.hr} />
        {createButtons()}
        <View style={_styles.hr} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 24 * p,
              height: 24 * p,
              borderRadius: 24 * p,
              backgroundColor: colors.accent100,
              marginRight: 8 * p,
            }}
          />
          <View style={{justifyContent: 'flex-start', flex: 1}}>
            <Text
              numberOfLines={1}
              w="b"
              c={dark ? colors.gray100 : colors.gray800}
              s={12 * p}>
              {userInfo?.surname} {userInfo?.name}
            </Text>
            <Text
              numberOfLines={1}
              w="r"
              c={dark ? colors.gray200 : colors.gray700}
              s={10 * p}>
              {shortDegreeName}
            </Text>
          </View>
          <PressableBase onPress={handleLogout}>
            <TablerIcon name="logout" size={24 * p} color={colors.accent300} />
          </PressableBase>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default Drawer;
