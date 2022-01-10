import { File, Cartella } from 'open-polito-api/corso';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import DirectoryItemRecursive from './DirectoryItemRecursive';
import NoContent from './NoContent';

type MaterialItem = File | Cartella;
type MaterialDict = { [code: string]: MaterialItem };

export default function MaterialExplorer({course: course_id}) {
  const [material, setMaterial] = useState<MaterialItem[]>([]);

  const [materialDict, setMaterialDict] = useState<MaterialDict>({});
  // The IDs of the top-level items
  const [firstLevel, setFirstLevel] = useState<string[]>([]);

  const materialState: {material: { [course_id: string]: MaterialItem[] } } = useSelector(state => state.material);

  // Initial setup. Get course material on course_id change
  useEffect(() => {
    setMaterial(
      course_id && materialState ? materialState.material[course_id] : [],
    );
  }, [course_id]);

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
    for (const item of items)
      dict[item.code] = item;

    return dict;
  }

  // recurse through the tree to generate an array of files
  function recurseGetMaterialList(material: MaterialItem[]): MaterialItem[] {
    return material.flatMap(item => [item].concat((item as Cartella).file || []));
  }

  // return array of folder contents (whole objects, 1 level depth)
  function getChildren(id: string) {
    return (materialDict[id] as Cartella).file.map(child => materialDict[child.code]);
  }

  return (
    <View style={{marginBottom: 50}}>
      {firstLevel.length > 0 ? (
        firstLevel.map(key => {
          return (
            <DirectoryItemRecursive
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
