import * as React from 'react';
import { ThreadProfile } from '../../components/thread/thread-profile';
import { ChapterList } from '../../components/thread/chapter-list';
import { ResData, API } from '../../../config/api';
import { NavBar } from '../../components/common/navbar';
import { MobileRouteProps } from '../router';
import { Post } from '../../components/thread/post';
import { Page } from '../../components/common/page';
import { Anchor, Pagination } from '../../components/common/pagination';

interface State {
  data:API.Get['/book/$0'];
}

/*
export class Book extends React.Component<MobileRouteProps, State> {
  public state:State = {
    data: {
      thread: ResData.allocThread(),
      chapters: [],
      volumns: [],
      most_upvoted: ResData.allocPost(),
      top_review: null,
      paginate: ResData.allocThreadPaginate(),
    },
  };

  public async componentDidMount () {
    const data = await this.props.core.db.getBook(+this.props.match.params.id);
    if (data) {
      this.setState({data});
    }
  }

  public render () {
    const { data } = this.state;
    return (
      <Page
        top={
          <NavBar goBack={this.props.core.history.goBack}>
            <div className="buttons">
              <Anchor className="button" isDisabled={true} to={''}>目录模式</Anchor>
              <Anchor className="button" to={''}>论坛模式</Anchor>
            </div>
          </NavBar>}
        >
        <ThreadProfile thread={data.thread} />
        <ChapterList bookId={+this.props.match.params.id} chapters={data.chapters} />

        <Pagination currentPage={data.paginate.current_page} lastPage={data.paginate.total_pages} />
        <Post data={data.most_upvoted} />
        {data.thread.last_post && <Post data={data.thread.last_post} />}
      </Page>
    );
  }
}
*/