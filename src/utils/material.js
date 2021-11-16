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

export async function getRecentMaterial(user) {
  // collect all material from all courses
  let material = [];
  function addMaterial(item) {
    material.push(item);
  }
  await Promise.all(
    user.carico_didattico.corsi.map(async corso => {
      const currentCourse = corso.nome;
      if (corso.materiale == undefined) {
        await corso.populate();
        findMaterialRecursively(corso.materiale, addMaterial, currentCourse);
      }
    }),
  );

  material.sort((a, b) => a.data_inserimento < b.data_inserimento);
  return material.slice(0, 3);
}
