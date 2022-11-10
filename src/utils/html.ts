import {decode} from 'html-entities';

export const htmlTags = /<\/?\w+[^>]*>/g;

export const stripHTML = (input: string): string => {
  return decode(input).replace(htmlTags, '');
};
