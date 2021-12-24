import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import DirectoryItemRecursive from './DirectoryItemRecursive';
import NoContent from './NoContent';

export default function MaterialExplorer({course: course_id}) {
  const material =
    course_id && useSelector(state => state.material)
      ? useSelector(state => state.material.material[course_id])
      : [];

  const materialDict = getMaterialDictionary();
  const firstLevel = getFirstLevel();

  // generate a dict of items from the tree.
  // item_id : {item_type, name, children_ids}
  function getMaterialDictionary() {
    let dict = {};
    function addToDict(key, item) {
      dict[key] = item;
    }
    recurseGetMaterialList(material, addToDict);
    return dict;
  }

  // recurse through the tree to generate the array.
  // item_id : {item_type, name, children_ids}
  function recurseGetMaterialList(material, addToDict) {
    material.forEach(item => {
      if (item.tipo == 'file') {
        addToDict(item.code, item);
      } else if (item.tipo == 'cartella') {
        let children = [];
        item.file.forEach(child => {
          if (child.tipo == 'file') {
            children.push(child.code);
          } else if (child.tipo == 'cartella') {
            children.push(child.nome);
          }
        });
        addToDict(item.nome, {...item, file: children});
        recurseGetMaterialList(item.file, addToDict);
      }
    });
  }

  // return array with first level item ids
  function getFirstLevel() {
    let firstLevel = [];
    material.forEach(item => {
      if (item.tipo == 'file') {
        firstLevel.push(item.code);
      } else if (item.tipo == 'cartella') {
        firstLevel.push(item.nome);
      }
    });
    return firstLevel;
  }

  // return array of folder contents (whole objects, 1 level depth)
  function getChildren(id) {
    let children = [];
    materialDict[id].file.forEach(child_id => {
      children.push(materialDict[child_id]);
    });
    return children;
  }

  return (
    <View style={{marginBottom: 50}}>
      {firstLevel.length > 0 ? (
        firstLevel.map(key => {
          return (
            <DirectoryItemRecursive
              key={
                materialDict[key].tipo == 'file'
                  ? materialDict[key].code
                  : materialDict[key].nome
              }
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
