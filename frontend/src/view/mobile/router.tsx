import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Core } from '../../core';
import { User } from './user';
import { Message } from './message';
import { PersonalMessage } from './message/personal-msg';
import { Dialogue } from './message/dialogue';
import { PublicNotice } from './message/public-notice';
import { Status } from './status';
import { LoginRoute } from './user/login';
import { HomeMain } from './home/main';
import { Chapter } from './forum/chapter';
import { CreateQuote } from './home/createquote';

import { Tidings } from './tidings';
import { RoutePath } from '../../config/route-path';
import { Forum } from './forum';
import { SearchPage } from './search/search-page';
import { Suggestion } from './home/suggestion';
import { Library } from './home/library';
import { Collection } from './collection';

interface Props {
  core:Core;
}

interface State {

}

export interface MobileRouteProps extends RouteComponentProps<any> {
  core:Core;
  path:string;
}

export const MobileRoutes = {
  // home
  [RoutePath.home]: HomeMain,
  [RoutePath.createQuote]: CreateQuote,
  [RoutePath.suggestion]: Suggestion,
  [RoutePath.library]: Library,
  [RoutePath.search]: SearchPage,
  // '/homebook': HomeBook,
  // '/homethread': HomeThread,
  // '/threads': HomeThread,
  // '/books': Books,
  // '/book/:id': Book,
  // '/thread/:id': Thread,

  // forum
  [RoutePath.forum]: Forum,
  [RoutePath.chapter]: Chapter,

  // user
  [RoutePath.user]: User,
  [RoutePath.login]: LoginRoute,
  [RoutePath.register]: LoginRoute,

  // collection
  [RoutePath.collection]: Collection,

  // status
  [RoutePath.status]: Status,

  //message
  [RoutePath.messages]: Message,
  [RoutePath.dialogue]: Dialogue,
  [RoutePath.personalMessages]: PersonalMessage,
  [RoutePath.publicNotice]: PublicNotice,

  [RoutePath.tidings]: Tidings,
};

export class MobileRouter extends React.Component<Props, State> {
  public render () {
    const { core } = this.props;
    const paths = Object.keys(MobileRoutes);

    return (<div>
      <Switch>
        {paths.map((_path, i) =>
          <Route exact={_path === '/'}
            path={_path}
            key={i}
            render={(props) => React.createElement(
              MobileRoutes[_path],
              {
                core,
                path: _path,
                ...props,
              },
            )}
          />,
        )}
      </Switch>
    </div>);
  }
}