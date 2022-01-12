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
    if (corso.codice + corso.nome == code) {
      _name = corso.nome;
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

export function getRecentMaterial(carico, materialTree) {
  let material = getMaterialList(carico, materialTree);
  return material.slice(0, 3);
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

export async function getDownloadUrl(user, code) {
  // incorrect use of the api library but it works
  // TODO fix
  const url = await user.carico_didattico.corsi[0].download(code);
  return url;
}
