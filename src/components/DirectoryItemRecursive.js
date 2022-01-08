import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import DirectoryItem from './DirectoryItem';

export default function DirectoryItemRecursive({item, getChildren}) {
  let children = [];
  if (item.tipo == 'cartella') {
    children = getChildren(item.nome);
  }
  const [opened, setOpened] = useState(false);

  /**
   * if item is file, render file item.
   * if item is directory, render directory item,
   * then iterate through its children and for each render this element again
   *
   */

  return (
    <View>
      {item.tipo == 'file' ? (
        <DirectoryItem
          tipo={item.tipo}
          key={item.code}
          nome={item.nome}
          filename={item.filename}
          data_inserimento={item.data_inserimento}
          size_kb={item.size_kb}
          code={item.code}
        />
      ) : (
        <View>
          <DirectoryItem
            tipo={item.tipo}
            key={item.nome}
            nome={item.nome}
            onPress={() => {
              setOpened(!opened);
            }}>
            {children.length > 0 && opened
              ? children.map(item => {
                  const key = item.tipo == 'file' ? item.code : item.nome;
                  return (
                    <DirectoryItemRecursive
                      key={key}
                      item={item}
                      getChildren={getChildren}
                    />
                  );
                })
              : null}
          </DirectoryItem>
        </View>
      )}
    </View>
  );
}
