import React, {useContext, useState} from 'react';
import {Linking, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import {UserContext} from '../context/User';
import getFileIcon from '../utils/get_file_icon';
import {getDownloadUrl} from '../utils/material';
import {TextS} from './Text';

export default function DirectoryItem({
  tipo, // "file" or "cartella"
  nome = null,
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
  const {user} = useContext(UserContext);
  const [textWidth, setTextWidth] = useState(null);

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
          {tipo == 'file' ? (
            getFileIcon(filename)
          ) : (
            <Icon name="folder-open" color={colors.black} size={28} />
          )}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginLeft: 8,
              width:
                textWidth == null
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
            <View flexDirection="column">
              <TextS text={corso != null ? corso : data_inserimento} />
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
            {corso != null ? <TextS text={data_inserimento} /> : null}
          </View>

          {tipo == 'file' ? (
            <Pressable
              android_ripple={{color: '#ccc'}}
              onPress={() => {
                getDownloadUrl(user, code).then(url => Linking.openURL(url));
              }}>
              <Icon name="file-download" size={24} color={colors.gradient1} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={{marginLeft: 16}}>{children}</View>
    </View>
  );
}
