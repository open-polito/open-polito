import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import {View} from 'react-native';
import {UserContext} from '../context/User';
import DirectoryItem from './DirectoryItem';
import {getRecentMaterial} from '../utils/material';
import DirectoryItemLoader from './DirectoryItemLoader';
import {useSelector, useDispatch} from 'react-redux';
import {setMaterial} from '../store/materialSlice';

export default function RecentItems() {
  const {user} = useContext(UserContext);
  const dispatch = useDispatch();
  const material = useSelector(state => state.material.material);

  useEffect(() => {
    if (material == null) {
      getRecentMaterial(user).then(data => {
        dispatch(setMaterial(data));
      });
    }
  }, []);

  return (
    <View style={{flexDirection: 'column'}}>
      {material != null ? (
        material.map(item => (
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
