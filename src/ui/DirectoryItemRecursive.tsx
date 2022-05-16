import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import {MaterialItem} from 'open-polito-api/material';

export default function DirectoryItemRecursive({
  dark,
  item,
  getChildren,
}: {
  dark: boolean;
  item: MaterialItem;
  getChildren: Function;
}) {
  let children: MaterialItem[] = [];
  if (item.type == 'dir') {
    children = getChildren(item.code);
  }
  const [opened, setOpened] = useState(false);

  return (
    <View>
      {item.type == 'file' ? (
        <DirectoryItem dark={dark} item={item} />
      ) : (
        <View>
          <DirectoryItem
            dark={dark}
            item={item}
            onPress={() => {
              setOpened(!opened);
            }}>
            {opened
              ? children.map(item => (
                  <DirectoryItemRecursive
                    dark={dark}
                    key={item.code}
                    item={item}
                    getChildren={getChildren}
                  />
                ))
              : []}
          </DirectoryItem>
        </View>
      )}
    </View>
  );
}
