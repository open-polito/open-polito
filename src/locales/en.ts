import Config from 'react-native-config';

const EN = {
  // General
  appName:
    Config.VARIANT == 'release'
      ? 'Open PoliTo'
      : `Open PoliTo [${Config.VARIANT}]`,
  search: 'Search',
  searchResults: '{{count}} results found',
  noResults: 'No results',
  open: 'Open',
  alerts: 'Alerts',
  oldVideos: 'Videos from previous years',
  noContent: 'Nothing to show...',
  videoPlayer: 'Video player',
  deadline: 'Deadline',

  // Splash screen
  loading: 'Loading...',

  // Login screen
  caption: 'The unofficial, open-source\nmobile app',
  loginCall: 'Log in',
  userPlaceholder: 'Username or e-mail address',
  passwordPlaceholder: 'Password',
  login: 'Log in',
  version: 'version',

  // Home screen
  home: 'Home',
  quickSearch: 'Quick search...',
  quickAccess: 'Quick access',
  edit: 'EDIT',
  allSections: 'All sections',

  // Sections
  examSessions: 'Exam sessions',
  schedule: 'Schedule',
  material: 'Material',
  courses: 'Courses',

  // Email screen
  email: 'E-mail',
  unreadEmail: '{{count}} unread email',
  unreadEmail_plural: '{{count}} unread emails',
  noEmailAccess: 'E-mail access is not available yet.',
  openBrowser: 'Tap to open in browser',

  // Settings screen
  settings: 'Settings',
  debugSettings: 'Debug settings',
  logout: 'Logout',
  notifications: 'Notifications',
  notificationsDesc: 'Manage your notification preferences',
  theme: 'Theme',
  themeDesc: 'Choose dark mode, customize colors',
  about: 'About',
  aboutDesc: 'About Open PoliTo',
  enableLogging: 'Enable logging',
  enableLoggingDesc: 'Save logs to device',

  // Material screen
  // material: 'Material',
  searchMaterial: 'Search material...',
  recentMaterial: 'Recent material',
  byCourse: 'By course',
  selectCourseDropdown: 'Select course...',
  selectCourse: 'Select a course to view its files',

  // Courses screen
  otherCourses: 'Other courses',

  // Course screen
  overview: 'Overview',
  info: 'Info',
  courseInfo: 'About this course',
  recordings: 'Recordings',
  videos: 'Videos',
  noVideos: 'No videos',

  // Exam sessions screen
  allExams: 'All exams',
  booked: 'Booked',
  availableToBook: 'Available to book',

  // Flash messages
  logoutFlashMessage: 'Logging out...',
  loginPendingFlashMessage: 'Connecting...',
  loginErrorFlashMessage: 'Authentication error',
  loginErrorFlashDesc:
    'Invalid credentials or Internet connection not available',
  loginSuccessFlashMessage: 'Log in successful!',
  notImplementedFlashMessage: 'Feature coming soon!',
  notImplementedFlashMessageDesc: 'Feature will be available in a next release',
  restartFlashMessage: 'Restart the app',

  // Additional screens...
};

export default EN;
