import { DB } from './db';
import { User } from './user';
import { History, UnregisterCallback, createBrowserHistory } from 'history';
import { EventBus } from '../utils/events';
import * as _ from 'lodash/core';
import { TagHandler } from './tag-handler';
import { Route } from './route';
import { saveStorage } from '../utils/storage';
import { Themes } from '../view/theme/theme';
const debounce = require('lodash/debounce');

export class Core {
  public db:DB;
  public user:User;
  public tag:TagHandler;
  public history:History;
  public unlistenHistory:UnregisterCallback;
  public windowResizeEvent:EventBus<void>;
  public route:Route;

  constructor () {
    this.history = createBrowserHistory();
    this.unlistenHistory = this.history.listen((location, action) => {
      console.log(action, location.pathname, location.state);
    });

    this.route = new Route(this.history);
    this.tag = new TagHandler();
    this.user = new User(this.history);
    this.db = new DB(this.user, this.history);
    this.windowResizeEvent = new EventBus();
    window.addEventListener('resize', debounce(() => {
      this.windowResizeEvent.notify(undefined);
    }));
  }

  public switchTheme (theme:Themes) {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.setAttribute('class', `theme-${theme}`);
      appElement.setAttribute('data-theme', theme);
      saveStorage('theme', theme);
    }
  }
}