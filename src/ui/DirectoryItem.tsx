import moment from 'moment';
import {File, getDownloadURL, MaterialItem} from 'open-polito-api/lib/material';
import React, {FC, ReactNode, useContext, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import getFileIcon from '../utils/getFileIcon';
import TablerIcon from './core/TablerIcon';
import {p} from '../scaling';
import Text from './core/Text';
import PressableBase from './core/PressableBase';
import {Device} from 'open-polito-api/lib/device';
import openURL from '../utils/openUrl';
import {genericPlatform} from '../utils/platform';

export type DirectoryItemProps = {
  item: MaterialItem;
  relativeDate?: boolean;
  dark: boolean;
  course?: string;
  onPress?: Function;
  children?: ReactNode;
};

const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];

export const computeSizeLabel = (size: number) => {
  const _size = Math.floor(size);
  const index = Math.min(
    _size > 0 ? Math.floor(Math.floor(Math.log10(_size)) / 3) : 0,
    sizes.length - 1,
  );
  return `${(_size / 10 ** (index === 0 ? 1 : 3 * index)).toFixed(2)} ${
    sizes[index]
  }`;
};

const downloadFile = (device: Device, item: File) => {
  getDownloadURL(device, item).then(url => openURL(url));
};

const DirectoryItem: FC<DirectoryItemProps> = ({
  item,
  relativeDate = false, // show as "X days/hours ago instead of plain date"
  dark,
  course = '',
  onPress = () => {},
  children,
}) => {
  const sizeLabel = useMemo(() => {
    return item.type === 'file' ? computeSizeLabel(item.size * 1000) : '';
  }, [item]);

  const {device} = useContext(DeviceContext);

  const iconComponent = useMemo(() => {
    return item.type === 'file' ? (
      getFileIcon(item.filename, dark)
    ) : (
      <TablerIcon
        name="folder"
        color={dark ? colors.gray200 : colors.gray700}
        size={24 * p}
      />
    );
  }, [item, dark]);

  return (
    <View
      style={{
        flexDirection: 'column',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
          flex: 1,
        }}>
        <PressableBase
          parentStyle={[
            {
              flexDirection: 'row',
              marginRight: 0 * p,
            },
            genericPlatform === 'mobile' && {flex: 1},
          ]}
          onPress={() => {
            item.type === 'file' ? downloadFile(device, item) : onPress();
          }} // download file if file, otherwise use onPress prop
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {iconComponent}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: 10 * p,
              flex: 1,
            }}>
            <View style={{marginRight: 10 * p, overflow: 'hidden'}}>
              <Text
                c={dark ? colors.gray100 : colors.gray800}
                w="m"
                s={12 * p}
                numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            {item.type === 'file' && (
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text numberOfLines={1} w="r" s={10 * p} c={colors.gray300}>
                  {sizeLabel + ' · '}
                  {relativeDate
                    ? moment(item.creation_date).fromNow()
                    : moment(item.creation_date).format('ll')}
                  {course ? ` · ${course}` : ''}
                </Text>
              </View>
            )}
          </View>
        </PressableBase>

        {item.type === 'file' ? (
          <PressableBase
            android_ripple={{color: colors.lightGray}}
            onPress={() => downloadFile(device, item)}>
            <TablerIcon
              name="download"
              size={24 * p}
              color={colors.accent300}
            />
          </PressableBase>
        ) : null}
      </View>
      {item.type === 'dir' ? (
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 16 * p,
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flex: 1,
                marginLeft: 4 * p,
                width: 2 * p,
                backgroundColor: dark ? colors.gray600 : colors.gray300,
              }}
            />
          </View>
          <View style={{flex: 1}}>{children}</View>
        </View>
      ) : null}
    </View>
  );
};

export default DirectoryItem;
