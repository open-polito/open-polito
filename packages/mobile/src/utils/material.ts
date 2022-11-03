import {File, MaterialItem} from 'open-polito-api/lib/material';

/**
 * Returns all files from the current directory level only
 * @param tree The tree of items
 * @returns List of files
 */
export const getLevelMaterialList = (tree: MaterialItem[]): File[] => {
  return tree.filter(item => item.type == 'file') as Array<File>;
};

/**
 * Returns all files from the whole material tree
 * @param tree The tree of items
 * @returns List of files
 */
export const getMaterialList = (tree: MaterialItem[]): File[] => {
  return tree
    .flatMap(item =>
      item.type == 'file'
        ? [item]
        : [item as MaterialItem].concat(getMaterialList(item.children)),
    )
    .filter(item => item.type == 'file') as Array<File>;
};

/**
 * Returns 3 most recent files from tree
 * @param tree The tree of items
 * @returns List of files
 */
export const getRecentCourseMaterial = (
  tree: MaterialItem[] | undefined,
): File[] => {
  return getMaterialList(tree || [])
    .sort((a, b) => b.creation_date - a.creation_date)
    .slice(0, 3);
};
