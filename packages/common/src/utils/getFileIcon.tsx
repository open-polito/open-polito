import colors from '../colors';
import {p} from '../scaling';
import TablerIcon from '../ui/core/TablerIcon';

const FILE_TYPES = [
  {
    icon: 'file-text',
    color: colors.gray200,
    colorLight: colors.gray700,
    extensions: ['csv', 'log', 'md', 'txt'],
  },
  {
    icon: 'archive',
    color: colors.gray200,
    colorLight: colors.gray700,
    extensions: ['7z', 'bz', 'gz', 'rar', 'tar', 'zip', 'xz'],
  },
  {
    icon: 'file-code',
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
    icon: 'photo',
    color: colors.gradient1,
    extensions: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'tiff'],
  },
  {
    icon: 'movie',
    color: colors.gradient1,
    extensions: ['flv', 'mkv', 'mp4', 'mov', 'wmv', 'avi', 'webm'],
  },
  {
    icon: 'headphones',
    color: colors.red,
    extensions: ['aac', 'alac', 'flac', 'm4a', 'mp3', 'ogg', 'wav', 'wma'],
  },
  {
    icon: 'file-text',
    color: colors.gradient1,
    extensions: ['doc', 'docm', 'docx', 'odt'],
  },
  {
    icon: 'file-text',
    color: '#ff3848',
    extensions: ['pdf'],
  },
  {
    icon: 'presentation',
    color: colors.orange,
    extensions: ['odp', 'ppt', 'pptm', 'pptx'],
  },
  {
    icon: 'table',
    color: colors.green,
    extensions: ['ods', 'xls', 'xlsm', 'xlsx'],
  },
];

export default function getFileIcon(filename: string, dark: boolean) {
  const ext = filename.split('.').pop()!.toLowerCase();
  for (let i = 0; i < FILE_TYPES.length; i++) {
    const {icon, extensions} = FILE_TYPES[i];
    if (extensions.includes(ext)) {
      const color = !dark
        ? FILE_TYPES[i].colorLight || FILE_TYPES[i].color
        : FILE_TYPES[i].color;
      return <TablerIcon name={icon} color={color} size={24 * p} />;
    }
  }
  return (
    <TablerIcon name="file-unknown" color={colors.gray500} size={24 * p} />
  );
}
