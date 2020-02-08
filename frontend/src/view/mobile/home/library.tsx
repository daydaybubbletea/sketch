import * as React from 'react';
import { MobileRouteProps } from '../router';
import { Page } from '../../components/common/page';
import { NavBar } from '../../components/common/navbar';
import { RoutePath } from '../../../config/route-path';

export class Library extends React.Component<MobileRouteProps, {
  // state
}> {
  public render () {
    return <Page top={<NavBar
      goBack={() => this.props.history.goBack()}
      onMenuClick={() => this.props.core.route.go(RoutePath.search)}
      menuIcon="fa fa-search"
    >文库</NavBar>}>

    </Page>;
  }
}