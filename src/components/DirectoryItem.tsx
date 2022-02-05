import moment from 'moment';
import React, {useContext, useState} from 'react';
import {Dimensions, Linking, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import styles from '../styles';
import getFileIcon from '../utils/getFileIcon';
import {getDownloadUrl} from '../utils/material';
import {TextS} from './Text';

export default function DirectoryItem({
  compact = false,
  relative_date = false, // show as "X days/hours ago instead of plain date"
  tipo, // "file" or "cartella"
  nome = null,
  filename = null,
  code,
  size_kb = null,
  data_inserimento = null,
  corso = null,
  children = null,
  onPress = () => {},
}) {
  let size_label =
    size_kb > 999 ? (size_kb / 1000).toFixed(2) + ' MB' : size_kb + ' kB';
  if (size_kb == null) {
    size_label = null;
  }
  const deviceContext = useContext(DeviceContext);
  const [textWidth, setTextWidth] = useState(null);

  const downloadFile = () => {
    getDownloadUrl(deviceContext.device, code).then(url =>
      Linking.openURL(url),
    );
  };

  return (
    <View style={{flexDirection: 'column'}}>
      <Pressable
        android_ripple={{color: colors.lightGray}}
        onPress={tipo == 'file' ? downloadFile : onPress} // download file if file, otherwise use onPress prop
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {tipo == 'file' ? (
            getFileIcon(filename)
          ) : (
            <Icon name="folder-open" color={colors.black} size={28} />
          )}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflow: 'hidden',
              marginLeft: 8,
              width: compact
                ? Dimensions.get('window').width -
                  2 * styles.withHorizontalPadding.paddingHorizontal -
                  240
                : textWidth == null
                ? '100%'
                : tipo == 'file'
                ? corso == null
                  ? textWidth - 175
                  : textWidth - 250
                : textWidth,
            }}
            onLayout={event => {
              textWidth == null && setTextWidth(event.nativeEvent.layout.width);
            }}>
            <TextS text={nome} numberOfLines={1} weight="bold" />
            {tipo == 'file' && (
              <View flexDirection="column">
                <TextS
                  numberOfLines={1}
                  text={
                    corso != null && !compact
                      ? corso
                      : relative_date
                      ? moment(data_inserimento).fromNow()
                      : moment(data_inserimento).format('lll')
                  }
                />
              </View>
            )}
          </View>
        </View>
        {!compact && (
          <View flexDirection="row" alignItems="center">
            <View
              flexDirection="column"
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginRight: 8,
              }}>
              <TextS text={size_label} />
              {corso != null ? (
                <TextS
                  text={
                    relative_date
                      ? moment(data_inserimento).fromNow()
                      : moment(data_inserimento).format('lll')
                  }
                />
              ) : null}
            </View>

            {tipo == 'file' ? (
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
