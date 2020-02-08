import * as React from 'react';
import { MobileRouteProps } from '../router';
import { API, ResData, ReqData } from '../../../config/api';
import { Page } from '../../components/common/page';
import { MainMenu } from '../main-menu';
import { SearchBar } from '../search/search-bar';

interface State {
  data:API.Get['/thread'];
}

export class Forum extends React.Component<MobileRouteProps, State> {
  public render () {
    return <Page bottom={<MainMenu />}>
      <SearchBar core={this.props.core} />
    </Page>;
  }
}