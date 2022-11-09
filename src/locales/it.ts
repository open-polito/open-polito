import Config from 'react-native-config';

const IT = {
  // General
  appName:
    Config.VARIANT === 'release'
      ? 'Open PoliTo'
      : `Open PoliTo\n[${Config.VARIANT}]`,
  search: 'Cerca',
  searchResults: '{{count}} risultati trovati',
  noResults: 'Nessun risultato',
  tryADifferentTerm: 'Prova un altro termine',
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
  files: 'File',
  cancel: 'Annulla',
  confirm: 'Conferma',
  enable: 'Abilita',
  bookVerb: 'Prenota',
  allCourses: 'Tutti i corsi',
  selectItem: 'Scegli elemento',
  selectAll: 'Seleziona tutto',
  deselectAll: 'Deseleziona tutto',
  delete: 'Elimina',
  markAsRead: 'Segna come letto',

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
  title1: 'Open source',
  desc1: 'Descrizione 1',
  title2: 'Potente',
  desc2: 'Descrizione 2',
  title3: 'Moderno',
  desc3: "Un'interfaccia moderna e facile da usare",
  agreement: 'Accedendo, acconsenti ai nostri',
  tos: 'Termini di servizio',
  privacyPolicy: 'Privacy policy',
  noUsernameProvided: 'Nessun nome utente inserito',
  noPasswordProvided: 'Nessuna password inserita',
  invalidUsernameProvided: 'Nome utente non valido',
  downloadNativeApp: "Scarica l'app",
  downloadNativeAppDescription:
    "Scarica l'app per accedere a tutte le funzionalità.\nDisponibile per Android, Windows, macOS e Linux",
  loginWebSpecificDescription:
    'Prova la versione web, nessun download richiesto',

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
  emailCannotBeShownDesktop:
    'La versione desktop non può mostrare le email qui',
  openBrowser: 'Apri nel browser',

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
  debugEnableLoggingDialogMessage: `<p>Questa opzione salva le richieste di rete e gli errori in un <b>file locale</b>.
  Deve essere utilizzata esclusivamente per il debugging.</p> <p><b>NON</b> condividere questi file
  con persone di cui non ti fidi, perché contengono dati del tuo account.</p>
  <p>Puoi trovare i file di log in <code>{{path}}</code>.</p>`,
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

  // Bookings screen
  newBooking: 'Nuova prenotazione',

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
  myBookings: 'Le mie prenotazioni',
  availableToBook: 'Prenotabili',
  unavailableExams: 'Non disponibili',
  bookingDeadline: 'Scadenza',
  confirmExamBooking: 'Conferma prenotazione esame',
  confirmExamBookingDialogMessage: `<p>Confermi la prenotazione dell'esame?</p>
  <ul><li>{{code}} - {{name}}</li><li>{{date}}</li><li>{{rooms}}</li></ul>`,
  cancelExamBooking: 'Annulla prenotazione esame',
  cancelExamBookingDialogMessage: `<p>Vuoi davvero <b>annullare</b> questa prenotazione?</p>
  <ul><li>{{code}} - {{name}}</li><li>{{date}}</li><li>{{rooms}}</li></ul>`,

  // Exams screen (Libretto)
  yourAverageMark: 'La tua media',
  yourAverageMarkNotice: 'Non depurata dai crediti più bassi',
  progressOverTime: 'Progresso nel tempo',
  weightedAverage: 'Media ponderata',
  permanentMarks: 'Valutazioni',
  provisionalMarks: 'Valutazioni provvisorie',
  statusCodeHelp: 'Cosa significano i codici di stato?',
  examAbsent: 'ASSENTE',
  examFailed: 'FALLITO',

  // Timetable screen
  jumpToDate: 'Vai a data',
  thisWeek: 'Questa settimana',
  timetableOptions: 'Opzioni orario',
  timetablePriority: 'Mostra per priorità',
  timetablePriorityDesc:
    'Gli eventi con priorità più alta verranno mostrati per primi',
  timetablePriorityList: 'Scegli priorità',

  // Updater screen
  newUpdateModalTitle: 'Aggiornamento disponibile',
  newUpdateModalText:
    "È disponibile un aggiornamento. Aggiorna l'app per accedere a nuove funzionalità e correzioni di bug.",
  newUpdateModalNotes: 'Note di aggiornamento:',
  updaterScreenHeading: 'Aggiornamento di Open PoliTo',
  updaterStateIdle: 'In attesa...',
  updaterStateGetData: 'Scaricando dati di aggiornamento...',
  updaterStateDownload: 'Download in corso...',
  updaterStateDone: 'Fatto! Installa il file.',
  updaterStateCheckIntegrity: 'Controllo integrità del file...',
  updaterStateError: "Errore durante l'aggiornamento!",
  tryAgain: 'Riprova',
  reopenInstallMenu: 'Riapri menu di installazione',
  didYouMissTheInstallMenu: 'Hai perso il menu di installazione?',

  // Toast
  logoutToastMessage: 'Disconnessione...',
  loginPendingToastMessage: 'Accesso...',
  loginErrorToastMessage: 'Errore di accesso',
  loginErrorFlashDesc:
    'Credenziali invalide o connessione Internet non disponibile',
  loginSuccessToastMessage: 'Accesso riuscito!',
  notImplementedToastMessage: 'Funzionalità in arrivo!',
  notImplementedToastMessageDesc:
    'Questa funzionalità sarà disponibile in una prossima versione',
  restartToastMessage: "Riavvia l'app",
  examsExamBookedToastMessage: 'Esame prenotato con successo!',
  examsExamBookingErrorToastMessage: "Errore: Impossibile prenotare l'esame",
  examsExamCanceledToastMessage: 'Prenotazione annullata con successo!',
  examsExamCancelingErrorToastMessage:
    'Errore: Impossibile annullare la prenotazione',

  // Info widgets
  wipInfoWidgetTitle: 'Lavori in corso',
  wipInfoWidgetDesc: 'Questa sezione è ancora in costruzione',

  // Additional screens...
};

export default IT;
