export enum RoutePath {
  home = '/',
  createQuote = '/createquote',
  suggestion = '/suggestion',
  library = '/library',
  search = '/search',

  // forum
  forum = '/thread_index',
  chapter = '/book/:bid/chapter/:cid',

  // user
  user = '/user',
  login = '/login',
  register = '/register',

  // collection
  collection = '/collection',

  // status
  statusCollection = '/status/collection',
  status = '/status/all',

  // messages
  messages = '/messages',
  dialogue = '/messages/pm/:uid',
  personalMessages = '/message/pm',
  publicNotice = '/messages/publicnotice',

  tidings = '/tidings',
}