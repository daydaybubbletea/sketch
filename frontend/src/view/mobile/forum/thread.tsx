import * as React from 'react';
import { ResData, API } from '../../../config/api';
import { NavBar } from '../../components/common/navbar';
import { URLParser } from '../../../utils/url';
import { MobileRouteProps } from '../router';
import { Post } from '../../components/thread/post';
import { Page } from '../../components/common/page';
import { Pagination } from '../../components/common/pagination';

interface State {
  data:API.Get['/thread/$0'];
}

/*
export class Thread extends React.Component<MobileRouteProps, State> {
  public state = {
    data: {
      thread: ResData.allocThread(),
      paginate: ResData.allocThreadPaginate(),
      posts: [] as ResData.Post[],
    },
  };

  public async componentDidMount () {
    const url = new URLParser();
    const id = this.props.match.params.id;

    const data = await this.props.core.db.getThread(+id, {
      page: url.getQuery('page'),
    });
    if (data) {
      this.setState({data});
    }
  }
  public render () {
    const { thread, paginate, posts } = this.state.data;

    return <Page
        top={
          <NavBar goBack={this.props.core.history.goBack}>
            {thread.attributes.title}
          </NavBar>
        }
      >
      <ThreadProfile data={thread} />
      {posts.map((post, idx) => <Post data={post} key={idx} />)}
      <Pagination currentPage={paginate.current_page} lastPage={paginate.total_pages} />
    </Page>;
  }
}
*/