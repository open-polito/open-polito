import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../colors';

const FILE_TYPES = [
  {
    icon: 'file-text-o',
    color: colors.black,
    extensions: ['csv', 'log', 'md', 'txt'],
  },
  {
    icon: 'file-archive-o',
    color: colors.black,
    extensions: ['7z', 'bz', 'gz', 'rar', 'tar', 'zip', 'xz'],
  },
  {
    icon: 'file-code-o',
    color: colors.black,
    extensions: [
      'asm',
      'c',
      'cpp',
      'cs',
      'css',
      'go',
      'h',
      'hpp',
      'htm',
      'html',
      'java',
      'js',
      'json',
      'jsx',
      'ts',
      'tsx',
      'php',
      'py',
      'rs',
      'xml',
    ],
  },
  {
    icon: 'file-image-o',
    color: colors.gradient1,
    extensions: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'tiff'],
  },
  {
    icon: 'file-video-o',
    color: colors.gradient1,
    extensions: ['flv', 'mkv', 'mp4', 'mov', 'wmv', 'avi', 'webm'],
  },
  {
    icon: 'file-audio-o',
    color: colors.red,
    extensions: ['aac', 'alac', 'flac', 'm4a', 'mp3', 'ogg', 'wav', 'wma'],
  },
  {
    icon: 'file-word-o',
    color: colors.gradient1,
    extensions: ['doc', 'docm', 'docx', 'odt'],
  },
  {
    icon: 'file-pdf-o',
    color: colors.red,
    extensions: ['pdf'],
  },
  {
    icon: 'file-powerpoint-o',
    color: colors.orange,
    extensions: ['odp', 'ppt', 'pptm', 'pptx'],
  },
  {
    icon: 'file-excel-o',
    color: colors.green,
    extensions: ['ods', 'xls', 'xlsm', 'xlsx'],
  },
];

export default function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  for (let i = 0; i < FILE_TYPES.length; i++) {
    const {icon, color, extensions} = FILE_TYPES[i];
    if (extensions.includes(ext)) {
      return <Icon name={icon} color={color} size={28} />;
    }
  }
  return <Icon name="file-o" color={colors.black} size={28} />;
}
