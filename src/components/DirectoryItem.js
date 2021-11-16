import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import {TextN, TextS} from './Text';

export default function DirectoryItem({
  tipo,
  filename,
  code,
  size_kb,
  data_inserimento,
  corso,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="insert-drive-file" color={colors.black} size={32} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginLeft: 8,
          }}>
          <TextS
            text={
              filename.length > 20
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
          <TextS text={`${size_kb} KB`} />
          <TextS text={data_inserimento} />
        </View>
        <Icon name="file-download" size={24} color={colors.gradient1} />
      </View>
    </View>
  );
}
