import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import {MaterialItem} from 'open-polito-api/material';

export default function DirectoryItemRecursive({
  item,
  getChildren,
}: {
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
        <DirectoryItem item={item} />
      ) : (
        <View>
          <DirectoryItem
            item={item}
            onPress={() => {
              setOpened(!opened);
            }}>
            {opened
              ? children.map(item => (
                  <DirectoryItemRecursive
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
