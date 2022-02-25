import moment from 'moment';
import {MaterialItem} from 'open-polito-api/material';
import React, {ReactNode, useContext, useState} from 'react';
import {Linking, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import getFileIcon from '../utils/getFileIcon';
import {getDownloadUrl} from '../utils/material';
import {TextS} from './Text';

export type DirectoryItemProps = {
  item: MaterialItem;
  compact?: boolean;
  relativeDate?: boolean;
  course?: string;
  children?: ReactNode[];
  onPress?: Function;
};

const computeSizeLabel = (size: number): string => {
  return size > 999 ? (size / 1000).toFixed(2) + ' MB' : size + ' kB';
};

export default function DirectoryItem({
  item,
  compact = false,
  relativeDate = false, // show as "X days/hours ago instead of plain date"
  course = '',
  children = [],
  onPress = () => {},
}: DirectoryItemProps) {
  const [sizeLabel, setSizeLabel] = useState(
    item.type == 'file' ? computeSizeLabel(item.size) : '',
  );

  const deviceContext = useContext(DeviceContext);

  const downloadFile = () => {
    getDownloadUrl(deviceContext.device, item.code).then(url =>
      Linking.openURL(url),
    );
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      <Pressable
        android_ripple={{color: colors.lightGray}}
        onPress={() => {
          item.type == 'file' ? downloadFile() : onPress();
        }} // download file if file, otherwise use onPress prop
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          {item.type == 'file' ? (
            getFileIcon(item.filename)
          ) : (
            <Icon name="folder-open" color={colors.black} size={28} />
          )}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginLeft: 8,
              flex: 1,
            }}>
            <View style={{marginRight: 16}}>
              <TextS text={item.name} numberOfLines={1} weight="bold" />
            </View>
            {item.type == 'file' && (
              <View style={{flexDirection: 'column', flex: 1}}>
                <TextS
                  numberOfLines={1}
                  text={
                    course && !compact
                      ? course
                      : relativeDate
                      ? moment(item.creation_date).fromNow()
                      : moment(item.creation_date).format('lll')
                  }
                />
              </View>
            )}
          </View>
        </View>
        {!compact && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginRight: 8,
              }}>
              <TextS text={sizeLabel} numberOfLines={1} />
              {course ? (
                <TextS
                  numberOfLines={1}
                  text={
                    item.type == 'file'
                      ? relativeDate
                        ? moment(item.creation_date).fromNow()
                        : moment(item.creation_date).format('lll')
                      : null
                  }
                />
              ) : null}
            </View>
            {item.type == 'file' ? (
              <Pressable
                android_ripple={{color: colors.lightGray}}
                onPress={downloadFile}>
                <Icon name="file-download" size={24} color={colors.gradient1} />
              </Pressable>
            ) : null}
          </View>
        )}
      </Pressable>
      <View style={{marginLeft: 16}}>{children}</View>
    </View>
  );
}
