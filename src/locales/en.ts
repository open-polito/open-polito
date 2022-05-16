import Config from 'react-native-config';

const EN = {
  // General
  appName:
    Config.VARIANT == 'release'
      ? 'Open PoliTo'
      : `Open PoliTo\n[${Config.VARIANT}]`,
  search: 'Search',
  searchResults: '{{count}} results found',
  noResults: 'No results',
  open: 'Open',
  alerts: 'Alerts',
  oldVideos: 'Videos from previous years',
  noContent: 'Nothing to show...',
  videoPlayer: 'Video player',
  deadline: 'Deadline',
  pleaseWait: 'Please wait...',
  allF: 'All',
  allM: 'All',
  directAlerts: 'Direct',
  test: 'Test',
  readF: 'Read',
  unreadF: 'Unread',
  searchForAnything: 'Search for anything',
  more: 'More',
  relatedVideos: 'Related videos',

  // Notifications
  defaultMsgTitle: '🚀 New notification',
  defaultMsgBody: 'Open the app to see it',

  // Splash screen
  loading: 'Loading...',
  retry: 'Retry',
  networkError: 'Network error',
  networkErrorDesc:
    'You are either offline or PoliTo servers are not available at the moment',

  // Login screen
  caption: 'The unofficial app for your\nPoliTo account',
  loginCall: 'Log in',
  userPlaceholder: 'Username or e-mail address (e.g. S123456)',
  passwordPlaceholder: 'Password',
  login: 'Log in',
  or: 'or',
  and: 'and',
  takeTour: 'Take the tour',
  version: 'version',
  title1: 'Title 1',
  desc1: 'Description 1',
  title2: 'Powerful',
  desc2:
    'With features like a download manager and a video player, your experience is going to be a breeze',
  title3: 'Modern',
  desc3: 'A modern, easy-to-use user interface',
  agreement: 'By logging in, you agree to our',
  tos: 'Terms of service',
  privacyPolicy: 'Privacy policy',

  // Home screen
  home: 'Home',
  quickSearch: 'Quick search...',
  quickAccess: 'Quick access',
  edit: 'EDIT',
  allSections: 'All sections',
  latestFiles: 'Latest files',
  latestAlert: 'Latest alert',

  // Sections
  examSessions: 'Exam sessions',
  timetable: 'Timetable',
  material: 'Material',
  courses: 'Courses',
  bookings: 'Bookings',
  exams: 'Exams',

  // Email screen
  email: 'E-mail',
  unreadEmail: '{{count}} unread email',
  unreadEmail_plural: '{{count}} unread emails',
  noEmailAccess: 'E-mail access is not available yet.',
  openBrowser: 'Tap to open in browser',

  // Settings screen
  settings: 'Settings',
  debugSettings: 'Debug settings',
  experimentalSettings: 'Experimental settings',
  logout: 'Logout',
  notifications: 'Notifications',
  notificationsDesc: 'Manage your notification preferences',
  theme: 'Theme',
  themeDesc: 'Choose dark mode, customize colors',
  about: 'About',
  aboutDesc: 'About Open PoliTo',
  // Debug settings
  debugEnableLogging: 'Enable logging',
  debugEnableLoggingDesc: 'Save logs to device',
  debugResetConfig: 'Reset configuration',
  debugResetConfigDesc: 'Restore to default settings',
  debugTestNotification: 'Send test notification',
  debugTestNotificationDesc:
    'You should receive a notification in a few seconds',

  // Experimental settings
  experimentalEmailWebView: 'Open e-mail in app',
  experimentalEmailWebViewDesc: 'Open e-mail page in a WebView',

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
  summary: 'Summary',
  info: 'Info',
  courseInfo: 'About this course',
  recordings: 'Recordings',
  videos: 'Videos',
  noVideos: 'No videos',

  // Exam sessions screen
  allExams: 'All exams',
  booked: 'Booked',
  availableToBook: 'Available to book',

  // Timetable screen
  jumpToDate: 'Jump to date',
  thisWeek: 'This week',
  timetableOptions: 'Timetable options',
  timetablePriority: 'Show by priority',
  timetablePriorityDesc: 'Events with higher priority will show first',
  timetablePriorityList: 'Choose priority',

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

  // Info widgets
  wipInfoWidgetTitle: 'Work in progress',
  wipInfoWidgetDesc: 'This section is still a work in progress',

  // Additional screens...
};

export default EN;
