import Corso from 'open-polito-api/corso';

function findMaterialRecursively(parentItem, pushFunction, currentCourse) {
  if (parentItem != undefined) {
    parentItem.map(item => {
      if (item.tipo == 'file') {
        pushFunction({...item, corso: currentCourse});
        // console.log(item);
      } else if (item.tipo == 'cartella') {
        // empty folder ?
        if (item.file.length > 0) {
          findMaterialRecursively(item.file, pushFunction, currentCourse);
        }
      }
    });
  }
}

function getCourseNameFromCode(corsi, code) {
  let _name = null;
  corsi.map(corso => {
    if (corso.codice == code) {
      _name = corso.nome;
    }
  });
  return _name;
}

export function getRecentMaterial(carico, materialTree) {
  let material = [];
  function addMaterial(item) {
    material.push(item);
  }
  for (const [key, val] of Object.entries(materialTree)) {
    findMaterialRecursively(
      val,
      addMaterial,
      getCourseNameFromCode(carico.corsi, key),
    );
  }
  material.sort((a, b) => a.data_inserimento < b.data_inserimento);
  return material.slice(0, 3);
}

export async function getMaterialTree(user) {
  let materialTree = {};
  await Promise.all(
    user.carico_didattico.corsi.map(async corso => {
      const currentCourse = corso.codice;
      if (corso.materiale == undefined) {
        await corso.populate();
        materialTree[currentCourse] = corso.materiale;
      }
    }),
  );
  return materialTree;
}

export async function getDownloadUrl(user, code) {
  // incorrect use of the api library but it works
  // TODO fix
  const url = await user.carico_didattico.corsi[0].download(code);
  return url;
}
