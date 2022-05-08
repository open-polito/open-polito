import React, {useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import BadgeContainer from './core/BadgeContainer';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

const Header = () => {
  const {dark} = useContext(DeviceContext);
  const _styles = useMemo(() => {
    return StyleSheet.create({
      header: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginVertical: 16,
        alignItems: 'center',
      },
      headerSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      headerMiddle: {
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
        <BadgeContainer number={10} style={{marginRight: 16}}>
          <TablerIcon
            name="menu-2"
            size={24}
            color={dark ? colors.gray100 : colors.gray800}
          />
        </BadgeContainer>
        <TablerIcon
          name="download"
          size={24}
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
          s={16}
          numberOfLines={1}>
          Exam sessions
        </Text>
      </View>
      <View style={{..._styles.headerSection, ..._styles.headerEnd}}>
        <TablerIcon
          name="search"
          size={24}
          color={dark ? colors.gray100 : colors.gray800}
          style={{marginRight: 16}}
        />
        {/* TODO add logic for badge number*/}
        <BadgeContainer number={10}>
          <TablerIcon
            name="bell"
            size={24}
            color={dark ? colors.gray100 : colors.gray800}
          />
        </BadgeContainer>
      </View>
    </View>
  );
};

export default Header;
