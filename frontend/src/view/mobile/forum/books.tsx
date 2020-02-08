import * as React from 'react';
import { MobileRouteProps } from '../router';
import { API, ResData, ReqData } from '../../../config/api';
import { URLParser } from '../../../utils/url';
import { UnregisterCallback } from 'history';
import { TagFilter } from '../../components/common/tag-filter';
import { ThreadPreview } from '../../components/thread/thread-preview';
import { Page } from '../../components/common/page';
import { Pagination } from '../../components/common/pagination';
import { List } from '../../components/common/list';

interface State {
  data:API.Get['/thread'];
  tags:ResData.Tag[]; //fixme:
}

/*
export class Books extends React.Component<MobileRouteProps, State> {
  public state:State = {
    data: {
      threads: [],
      paginate: ResData.allocThreadPaginate(),
    },
    tags: [],
  };

  public unListen:UnregisterCallback|null = null;

  public componentDidMount () {
    this.loadData();
    this.unListen = this.props.core.history.listen(() => this.loadData());
  }

  public componentWillUnmount () {
    this.unListen && this.unListen();
  }

  public loadData (tags?:number[]) {
    const url = new URLParser();
    if (url.getAllPath()[0] !== this.props.path) { return; }

    this.props.core.db.getThreadList({
      page: url.getQuery('page'),
      tags: tags || url.getQuery('tags'),
      channels: url.getQuery('channels'),
      withType: ReqData.Thread.withType.book,
      ordered: url.getQuery('ordered'),
    })
      .then((data) => {
        this.setState({data});
        this.loadNoTongrenTags();
      })
      .catch(console.error);
  }

  public loadNoTongrenTags () {
    this.props.core.db.getNoTongrenTags()
      .then((tags) => this.setState({tags}))
      .catch(console.error);
  }

  public render () {
    return <Page top={<HomeMenu />}>
      <TagFilter
        tags={this.state.tags}
        search={(pathname, tags) => {
          this.props.core.history.push(pathname, {tags});
        }}
        getFullList={() => {
          this.loadNoTongrenTags();
      }} />
      <Pagination
        currentPage={this.state.data.paginate.current_page}
        lastPage={this.state.data.paginate.total_pages}
      />
      <List
        children={this.state.data.threads.map((thread) =>
          <ThreadPreview data={thread} key={thread.id} />)}
      />
    </Page>;
  }
}
*/