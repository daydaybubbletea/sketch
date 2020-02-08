import * as React from 'react';
import { Quotes } from '../../components/home/quotes';
import { API } from '../../../config/api';
import { MobileRouteProps } from '../router';
import { Page } from '../../components/common/page';
import { MainMenu } from '../main-menu';
import { SearchBar } from '../search/search-bar';
import { RoutePath } from '../../../config/route-path';
import { ChannelPreview } from '../../components/home/channel-preview';
import { Button } from '../../components/common/button';
import './main.scss';

type ListItem = {
  title:string;
  content:string;
  author:string;
  id:number;
};

interface State {
  data:API.Get['/'];
}

export class HomeMain extends React.Component<MobileRouteProps, State> {
  public state:State = {
    data:{
      quotes: [],
      recent_recommendations: [],
      homeworks: [],
      channel_threads: [],
    },
  };

  public async componentDidMount () {
    try {
      const data = await this.props.core.db.getPageHome();
      this.setState({data});
    } catch (err) {
      console.error(err);
    }
  }

  public render () {
    return (<Page bottom={<MainMenu />} className="page-main">
      <SearchBar core={this.props.core} />
      <Quotes
        quotes={this.state.data.quotes}
        core={this.props.core}
      />
      <div className="main-buttons">
        {this.renderMainButton('推荐', 'fas fa-fire', RoutePath.suggestion)}
        {this.renderMainButton('文库', 'fas fa-book-open', RoutePath.library)}
      </div>

      <ChannelPreview
        title={'推荐榜单'}
        threads={[]}
        goToThread={(id) => this.props.core.route.thread(id)}
      />
      <ChannelPreview
        title={'原创榜单'}
        threads={[]}
        goToThread={(id) => this.props.core.route.thread(id)}
      />
      <ChannelPreview
        title={'同人榜单'}
        threads={[]}
        goToThread={(id) => this.props.core.route.thread(id)}
      />
    </Page>);
  }

  public renderMainButton = (text:string, icon:string, link:RoutePath) => {
    return <Button onClick={() => this.props.core.route.go(link)}
      icon={icon}
      color="primary"
    >{text}</Button>;
  }
}