import config from '@config';

const IT = {
  // General
  appName: (config.variant == "release") ? "Open PoliTo" : `Open PoliTo [${config.variant}]`,
  search: 'Cerca',
  searchResults: '{{count}} risultati trovati',
  noResults: 'Nessun risultato',
  open: 'Apri',
  alerts: 'Avvisi',
  oldVideos: 'Video di anni precedenti',
  noContent: 'Nulla da mostrare...',
  videoPlayer: 'Player video',
  deadline: 'Scadenza',

  // Splash screen
  loading: 'Caricamento...',

  // Login screen
  caption: "L'app open-source\nnon ufficiale",
  loginCall: 'Accedi',
  userPlaceholder: 'Codice utente o indirizzo e-mail',
  passwordPlaceholder: 'Password',
  login: 'Accedi',
  version: 'versione',

  // Home screen
  home: 'Home',
  quickSearch: 'Ricerca rapida...',
  quickAccess: 'Accesso rapido',
  edit: 'MODIFICA',
  allSections: 'Tutte le sezioni',

  // Sections
  examSessions: "Sessioni d'esame",
  schedule: 'Orario',
  material: 'Materiale',
  courses: 'Corsi',

  // Email screen
  email: 'E-mail',
  unreadEmail: '{{count}} e-mail non letta',
  unreadEmail_plural: '{{count}} e-mail non lette',
  noEmailAccess: "L'accesso alle e-mail non è ancora disponibile.",
  openBrowser: 'Tocca per aprire nel browser',

  // Settings screen
  settings: 'Impostazioni',
  debugSettings: 'Impostazioni di debug',
  logout: 'Esci',
  notifications: 'Notifiche',
  notificationsDesc: 'Gestisci le tue preferenze di notifica',
  theme: 'Tema',
  themeDesc: 'Scegli la dark mode, personalizza i colori',
  about: 'Informazioni',
  aboutDesc: 'Informazioni su Open PoliTo',
  enableLogging: 'Abilita logging',
  enableLoggingDesc: 'Salva i log nel dispositivo',

  // Material screen
  // material: 'Materiale',
  searchMaterial: 'Cerca materiale...',
  recentMaterial: 'Materiali recenti',
  byCourse: 'Per corso',
  selectCourseDropdown: 'Seleziona corso...',
  selectCourse: 'Seleziona un corso per vederne i file',

  // Courses screen
  otherCourses: 'Altri corsi',

  // Course screen
  overview: 'Riepilogo',
  info: 'Info',
  courseInfo: 'Informazioni sul corso',
  recordings: 'Registrazioni',
  videos: 'Video',
  noVideos: 'Nessun video',

  // Exam sessions screen
  allExams: 'Tutti gli esami',
  booked: 'Prenotati',
  availableToBook: 'Prenotabili',

  // Flash messages
  logoutFlashMessage: 'Disconnessione...',
  loginPendingFlashMessage: 'Accesso...',
  loginErrorFlashMessage: 'Errore di accesso',
  loginErrorFlashDesc:
    'Credenziali invalide o connessione Internet non disponibile',
  loginSuccessFlashMessage: 'Accesso riuscito!',
  notImplementedFlashMessage: 'Funzionalità in arrivo!',
  notImplementedFlashMessageDesc:
    'Questa funzionalità sarà disponibile in una prossima versione',
  restartFlashMessage: "Riavvia l'app",

  // Additional screens...
};

export default IT;