import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import {TextN, TextS} from './Text';

export default function DirectoryItem({
  tipo, // "file" or "cartella"
  filename = null,
  code,
  size_kb = null,
  data_inserimento = null,
  corso = null,
  children,
}) {
  let size_label =
    size_kb > 999 ? (size_kb / 1000).toFixed(2) + ' MB' : size_kb + ' kB';
  if (size_kb == null) {
    size_label = null;
  }
  const filenameLengthLimit = tipo == 'file' ? 20 : 40;
  const iconName = tipo == 'file' ? 'insert-drive-file' : 'folder-open';
  return (
    <View style={{flexDirection: 'column'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 8,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={iconName} color={colors.black} size={32} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginLeft: 8,
            }}>
            <TextS
              text={
                filename.length > filenameLengthLimit
                  ? filename.substring(0, 20) + '...'
                  : filename
              }
              weight="bold"
            />
            <View flexDirection="column">
              <TextS text={corso} />
            </View>
          </View>
        </View>
        <View flexDirection="row" alignItems="center">
          <View
            flexDirection="column"
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginRight: 8,
            }}>
            <TextS text={size_label} />
            <TextS text={data_inserimento} />
          </View>

          {tipo == 'file' ? (
            <Icon name="file-download" size={24} color={colors.gradient1} />
          ) : null}
        </View>
      </View>
      <View style={{marginLeft: 16}}>{children}</View>
    </View>
  );
}
