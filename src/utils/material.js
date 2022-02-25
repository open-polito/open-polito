import {getDownloadURL} from 'open-polito-api/material';

function findMaterialRecursively(parentItem, pushFunction, currentCourse) {
  if (parentItem != undefined) {
    parentItem.map(item => {
      if (item.type == 'file') {
        pushFunction({...item, corso: currentCourse});
        // console.log(item);
      } else if (item.tipo == 'cartella') {
        // empty folder ?
        if (item.children.length > 0) {
          findMaterialRecursively(item.children, pushFunction, currentCourse);
        }
      }
    });
  }
}

function getCourseNameFromCode(corsi, code) {
  let _name = null;
  corsi.map(corso => {
    if (corso.code + corso.name == code) {
      _name = corso.name;
    }
  });
  return _name;
}

export function getMaterialList(carico, materialTree) {
  let material = [];
  function addMaterial(item) {
    material.push(item);
  }
  for (const [key, val] of Object.entries(materialTree)) {
    findMaterialRecursively(
      val,
      addMaterial,
      carico != null
        ? getCourseNameFromCode([...carico.corsi, ...carico.extra_courses], key)
        : null,
    );
  }
  material.sort((a, b) => {
    return new Date(b.data_inserimento) - new Date(a.data_inserimento);
  });
  return material;
}

export function getRecentCourseMaterial(materialTree) {
  let material = getMaterialList(null, {code: materialTree});
  return material.slice(0, 3);
}

export async function getMaterialTree(user) {
  let materialTree = {};
  await Promise.all(
    [
      ...user.carico_didattico.corsi,
      ...user.carico_didattico.extra_courses,
    ].map(async corso => {
      const currentCourse = corso.codice + corso.nome;
      if (corso.materiale == undefined) {
        await corso.populate();
        materialTree[currentCourse] = corso.materiale;
      }
    }),
  );
  return materialTree;
}

export async function getDownloadUrl(device, code) {
  // incorrect use of the api library but it works
  // TODO fix
  const url = await getDownloadURL(device, code);
  return url;
}
