import {Directory, MaterialItem} from 'open-polito-api/material';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import DirectoryItemRecursive from './DirectoryItemRecursive';
import NoContent from '../components/NoContent';

type MaterialDict = {[code: string]: MaterialItem};

export default function MaterialExplorer({
  courseId,
  dark,
}: {
  courseId: string;
  dark: boolean;
}) {
  const [material, setMaterial] = useState<MaterialItem[]>([]);

  const [materialDict, setMaterialDict] = useState<MaterialDict>({});

  // The IDs of the top-level items
  const [firstLevel, setFirstLevel] = useState<string[]>([]);

  const materialState = useSelector<RootState, MaterialItem[] | undefined>(
    state =>
      state.courses.courses.find(
        course => courseId == course.basicInfo.code + course.basicInfo.name,
      )?.extendedInfo?.material,
  );

  // Initial setup. Get course material on course_id change
  useEffect(() => {
    setMaterial(materialState || []);
  }, [courseId]);

  // On course material change & on first render
  useEffect(() => {
    setMaterialDict(getMaterialDictionary());
    setFirstLevel(material.map(item => item.code));
  }, [material]);

  // generate a dict of items from the tree.
  // item_id : {item_type, name, children_ids}
  function getMaterialDictionary(): MaterialDict {
    const items = recurseGetMaterialList(material);
    const dict: MaterialDict = {};
    for (const item of items) dict[item.code] = item;

    return dict;
  }

  // recurse through the tree to generate an array of files
  function recurseGetMaterialList(material: MaterialItem[]): MaterialItem[] {
    return material.flatMap(item =>
      item.type == 'file'
        ? [item]
        : [item as MaterialItem].concat(recurseGetMaterialList(item.children)),
    );
  }

  // return array of folder contents (whole objects, 1 level depth)
  function getChildren(id: string): MaterialItem[] {
    return (materialDict[id] as Directory).children.map(
      child => materialDict[child.code],
    );
  }

  return (
    <View>
      {firstLevel.length > 0 ? (
        firstLevel.map(key => {
          return (
            <DirectoryItemRecursive
              dark={dark}
              key={materialDict[key].code}
              item={materialDict[key]}
              getChildren={getChildren}
            />
          );
        })
      ) : (
        <View style={{marginTop: 16}}>
          <NoContent />
        </View>
      )}
    </View>
  );
}
