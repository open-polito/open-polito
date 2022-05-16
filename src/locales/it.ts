import Config from 'react-native-config';

const IT = {
  // General
  appName:
    Config.VARIANT == 'release'
      ? 'Open PoliTo'
      : `Open PoliTo\n[${Config.VARIANT}]`,
  search: 'Cerca',
  searchResults: '{{count}} risultati trovati',
  noResults: 'Nessun risultato',
  open: 'Apri',
  alerts: 'Avvisi',
  oldVideos: 'Video di anni precedenti',
  noContent: 'Nulla da mostrare...',
  videoPlayer: 'Player video',
  deadline: 'Scadenza',
  pleaseWait: 'Per favore attendi...',
  allF: 'Tutte',
  allM: 'Tutti',
  directAlerts: 'Individuali',
  test: 'Test',
  readF: 'Lette',
  unreadF: 'Non lette',
  searchForAnything: 'Cerca qualcosa...',
  more: 'Altro',
  relatedVideos: 'Video correlati',

  // Notifications
  defaultMsgTitle: '🚀 Nuova notifica',
  defaultMsgBody: "Apri l'app per vederla",

  // Splash screen
  loading: 'Caricamento...',
  retry: 'Riprova',
  networkError: 'Errore di rete',
  networkErrorDesc:
    'Sei offline o i server PoliTo non sono attualmente disponibili',

  // Login screen
  caption: "L'app non ufficiale per il\ntuo account PoliTo",
  loginCall: 'Accedi',
  userPlaceholder: 'Codice utente o indirizzo e-mail (es. S123456)',
  passwordPlaceholder: 'Password',
  login: 'Accedi',
  or: 'oppure',
  and: 'e',
  takeTour: 'Fai il tour',
  version: 'versione',
  title1: 'Titolo 1',
  desc1: 'Descrizione 1',
  title2: 'Potente',
  desc2:
    'Grazie a funzionalità come un download manager e il video player integrato',
  title3: 'Moderno',
  desc3: "L'app ha un'interfaccia moderna e facile da usare",
  agreement: 'Accedendo, acconsenti ai nostri',
  tos: 'Termini di servizio',
  privacyPolicy: 'Privacy policy',

  // Home screen
  home: 'Home',
  quickSearch: 'Ricerca rapida...',
  quickAccess: 'Accesso rapido',
  edit: 'MODIFICA',
  allSections: 'Tutte le sezioni',
  latestFiles: 'Ultimi file',
  latestAlert: 'Ultimo avviso',

  // Sections
  examSessions: 'Sessioni',
  timetable: 'Orario',
  material: 'Materiale',
  courses: 'Corsi',
  bookings: 'Prenotazioni',
  exams: 'Libretto',

  // Email screen
  email: 'E-mail',
  unreadEmail: '{{count}} e-mail non letta',
  unreadEmail_plural: '{{count}} e-mail non lette',
  noEmailAccess: "L'accesso alle e-mail non è ancora disponibile.",
  openBrowser: 'Tocca per aprire nel browser',

  // Settings screen
  settings: 'Impostazioni',
  debugSettings: 'Impostazioni di debug',
  experimentalSettings: 'Impostazioni sperimentali',
  logout: 'Esci',
  notifications: 'Notifiche',
  notificationsDesc: 'Gestisci le tue preferenze di notifica',
  theme: 'Tema',
  themeDesc: 'Scegli la dark mode, personalizza i colori',
  about: 'Informazioni',
  aboutDesc: 'Informazioni su Open PoliTo',
  // Debug settings
  debugEnableLogging: 'Abilita logging',
  debugEnableLoggingDesc: 'Salva i log nel dispositivo',
  debugResetConfig: 'Ripristina impostazioni',
  debugResetConfigDesc: 'Torna alle impostazioni iniziali',
  debugTestNotification: 'Invia notifica di test',
  debugTestNotificationDesc: 'Dovresti ricevere una notifica in pochi secondi',
  // Experimental settings
  experimentalEmailWebView: 'Apri e-mail in app',
  experimentalEmailWebViewDesc: 'Apri la schermata e-mail in una WebView',

  // Material screen
  // material: 'Materiale',
  searchMaterial: 'Cerca materiale...',
  recentMaterial: 'Materiali recenti',
  byCourse: 'Per corso',
  selectCourseDropdown: 'Seleziona corso...',
  selectCourse: 'Seleziona un corso per vederne i file',
  explore: 'Esplora',
  recentlyAdded: 'Aggiunti di recente',

  // Courses screen
  otherCourses: 'Altri corsi',

  // Course screen
  overview: 'Riepilogo',
  summary: 'Overview',
  info: 'Info',
  courseInfo: 'Informazioni sul corso',
  recordings: 'Registrazioni',
  videos: 'Video',
  noVideos: 'Nessun video',

  // Exam sessions screen
  allExams: 'Tutti gli esami',
  booked: 'Prenotati',
  availableToBook: 'Prenotabili',

  // Timetable screen
  jumpToDate: 'Vai a data',
  thisWeek: 'Questa settimana',
  timetableOptions: 'Opzioni orario',
  timetablePriority: 'Mostra per priorità',
  timetablePriorityDesc:
    'Gli eventi con priorità più alta verranno mostrati per primi',
  timetablePriorityList: 'Scegli priorità',

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

  // Info widgets
  wipInfoWidgetTitle: 'Lavori in corso',
  wipInfoWidgetDesc: 'Questa sezione è ancora in costruzione',

  // Additional screens...
};

export default IT;
