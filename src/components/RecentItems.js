import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import {View} from 'react-native';
import {UserContext} from '../context/User';
import DirectoryItem from './DirectoryItem';
import {getRecentMaterial} from '../utils/material';
import DirectoryItemLoader from './DirectoryItemLoader';

export default function RecentItems() {
  const {user} = useContext(UserContext);
  const [items, setItems] = useState(null);

  useEffect(() => {
    getRecentMaterial(user).then(data => {
      setItems(data);
    });
  }, []);

  return (
    <View style={{flexDirection: 'column'}}>
      {items ? (
        items.map(item => (
          <DirectoryItem
            key={item.code}
            filename={item.filename}
            data_inserimento={item.data_inserimento}
            corso={item.corso}
            size_kb={item.size_kb}
          />
        ))
      ) : (
        <View>
          <DirectoryItemLoader />
          <DirectoryItemLoader />
          <DirectoryItemLoader />
        </View>
      )}
    </View>
  );
}
