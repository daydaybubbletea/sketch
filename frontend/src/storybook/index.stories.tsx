import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';

import '../view/common.scss';
import '../view/theme/index.scss';

import { action } from '@storybook/addon-actions';
import { withConsole } from '@storybook/addon-console';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { withViewport } from '@storybook/addon-viewport';
import { addDecorator, storiesOf } from '@storybook/react';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { Accordion } from '../view/components/common/accordion';
import { Animate } from '../view/components/common/animate';
import { Badge } from '../view/components/common/badge';
import { Card } from '../view/components/common/card';
import { Center } from '../view/components/common/center';
import { Dropdown } from '../view/components/common/dropdown';
import { FilterBar } from '../view/components/common/filter-bar';
import { List } from '../view/components/common/list';
import { InfiniteScroll } from '../view/components/common/infiniteScroll';
import { Mark } from '../view/components/common/mark';
import { NavBar } from '../view/components/common/navbar';
import { Popup } from '../view/components/common/popup';
import { PopupMenu } from '../view/components/common/popup-menu';
import { RouteMenu } from '../view/components/common/route-menu';
import { Slider } from '../view/components/common/slider';
import { Tab } from '../view/components/common/tab';
import { Tag, TagColor } from '../view/components/common/tag';
import { TagList } from '../view/components/common/tag-list';
import { FloatButton } from '../view/components/common/float-button';
import { Core } from '../core/index';
import { Carousel } from '../view/components/common/carousel';
import { NoticeBar } from '../view/components/common/notice-bar';
import { Loading } from '../view/components/common/loading';
import { ResizableTextarea } from '../view/components/common/resizable-textarea';
import { ThreadPreview } from '../view/components/thread/thread-preview';
import { randomCnWords } from '../utils/fake';
import { ChannelPreview } from '../view/components/home/channel-preview';
import { TagBasic } from '../view/components/home/tagbasic';
import { TagBasicList } from '../view/components/home/tagbasic-list';
import { TagBasicListSelect } from '../view/components/home/tagbasiclist-select';
import { TagBasicListFilter } from '../view/components/home/tagbasiclist-filter';
import { RecommendList } from '../view/components/home/recommend-list';
import { ChatBubble } from '../view/components/message/chat-bubble';
import { ExpandableMessage } from '../view/components/message/expandable-message';
import { Fragment } from 'react';
import { fakeDB } from '../test/mock-data/fake-db';
import { Button } from '../view/components/common/button';

const core = new Core();
fakeDB(core.db);

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withViewport());
addDecorator(withKnobs);

storiesOf('Common Components', module)
  .add('button', () => <Button
    onClick={action('onClick')}
    icon={text('icon', 'fa fa-search')}
    disabled={boolean('disabled', false)}
    color={select('color', {primary: 'primary', default: ''}, '')}
    size={select('size', {default: '', small: 'small'}, '')}
    type={select('type', {default: '', ellipse: 'ellipse'}, '')}
  >I am a button</Button>)
  .add('Badge', () => <Badge num={number('num', 10)}
      max={number('max', 0)}
      dot={boolean('dot', false)}
      hidden={boolean('hidden', false)}>
      {text('text', 'test')}
    </Badge>,
  )
  .add('Tag', () => {
    const colorOptions:{[name:string]:TagColor} = {
      black: 'black',
      dark: 'dark',
      light: 'light',
      white: 'white',
      primary: 'primary',
      link: 'link',
      info: 'info',
      success: 'success',
      warning: 'warning',
      danger: 'danger',
    };
    return <Tag
      selected={boolean('selected', false)}
      onClick={action('tag click')}
      size={select('size', {
        normal: 'normal',
        medium: 'medium',
        large: 'large',
      },           'normal')}
      color={select('color', colorOptions, undefined)}
      selectedColor={select('selectedColor', colorOptions, undefined)}
      rounded={boolean('rounded', false)}
      selectable={boolean('selectable', true)}
    >{text('text', 'test')}</Tag>;
  })
  .add('TagList', () => {
    const colorOptions:{[name:string]:TagColor} = {
      black: 'black',
      dark: 'dark',
      light: 'light',
      white: 'white',
      primary: 'primary',
      link: 'link',
      info: 'info',
      success: 'success',
      warning: 'warning',
      danger: 'danger',
    };
    return <TagList>
      {(new Array(number('length', 20)).fill(text('text', 'tag')).map((content, i) => <Tag
        key={i}
        onClick={action('tag click ' + i)}
        size={select('size', {
          normal: 'normal',
          medium: 'medium',
          large: 'large',
        },           'normal')}
        color={select('color', colorOptions, undefined)}
        selectedColor={select('selectedColor', colorOptions, undefined)}
        rounded={boolean('rounded', false)}
        selectable={boolean('selectable', true)}
      >{content}</Tag>))}
    </TagList>;
  })

  .add('FilterBar', () => {
    return <FilterBar></FilterBar>;
  })
  .add('Popup', () => React.createElement(class extends React.Component {
    public state = {
      showPopup: true,
    };
    public render () {
      return <div>
        <button className="button" onClick={() => this.setState({showPopup: true})}>show popup</button>
        {this.state.showPopup &&
          <Popup
            width={text('width', '')}
            bottom={text('bottom', '')}
            darkBackground={number('darkBackground', 0.8)}
            onClose={() => this.setState({showPopup: false})}>
            {text('content', 'example content')}
          </Popup>
        }
      </div>;
    }
  }))
  .add('Center', () => <Center width={text('width', '')} height={text('height', '')}>
    <div>center anything</div>
  </Center>)
  .add('List', () => <List>
    {['a', 'b', 'c'].map((item, i) => <List.Item
      key={i}
      onClick={() => alert('click item ' + item)}
      arrow={boolean('arrow', false)}>
      {item}
    </List.Item>)}
  </List>)
  .add('InfiniteScroll', () => React.createElement(class extends React.Component {
    public state = {
      items: [],
      isLoading: true,
      cursor: 0,
    }
    private divStyle = {
      border: '5px solid pink',
      background: 'antiquewhite',
      height: '250px',
      width: '300px',
    };

    public componentDidMount() {
      // do some paginated fetch
      this.loadMore();
    }

    public loadMore = () => {
      const cursor = this.state.cursor;
      this.setState({ isLoading: true, error: undefined });
      const load = new Promise<number[]>((resolve, reject) => {
        setTimeout(() => resolve([cursor, cursor + 1, cursor + 2, cursor + 3, cursor + 4, cursor + 5]), 500);
      });

      // cursor should not be used like this. It should be used to make paginated db fetch, but here it's used to generate dumb data
      load
        .then(
          (res) =>
            (this.setState({
              items: [...this.state.items, ...res],
              cursor: res[5] + 1,
              isLoading: false
            }))
          ,
          (error) => {
            this.setState({ isLoading: false, error })
          }
      )
    }

    public render() {
      // here the internal element is <p>, but it can be any element
      return (
        <Fragment>
        <div style={this.divStyle}>
          <InfiniteScroll
            throttle={100}
            threshold={50}
            isLoading={this.state.isLoading}
            hasMore={this.state.cursor < 200}
            onLoadMore={this.loadMore}
          >
            {this.state.items.length > 0
              ? this.state.items.map((item, i) => (
                  <p key={i}>{item}</p>
                ))
              : null}
          </InfiniteScroll>
          {this.state.isLoading && (
            <p>Loading...</p>
          )}
        </div>
        </Fragment>
      )
    }
  }))
  .add('Accordion', () => <Accordion
    title={text('title', 'accordion title')}
    arrow={boolean('arrow', true)}
  >
    <List>
      <List.Item>1</List.Item>
      <List.Item>2</List.Item>
    </List>
  </Accordion>)
  .add('Menu', () => React.createElement(class extends React.Component {
    public state = {
      onIndex: 0,
      icon: boolean('icon', false),
    };
    public render () {
      const items = [
        {to: '', label: 'menu1'},
        {to: '', label: 'menu2'},
        {to: '', label: 'menu3'},
      ];
      if (this.state.icon) {
        for (let i = 0; i < items.length; i ++) {
          const item = items[i];
          item['icon'] = 'fas fa-star';
          item['selectedColor'] = 'red';
          item['defaultColor'] = 'black';
        }
      }
      return <Router history={createBrowserHistory()}>
          <RouteMenu
            items={items}
            onIndex={this.state.onIndex}
            onClick={(_, i) => this.setState({onIndex: i})}
          ></RouteMenu>
      </Router>;
    }
  }))
  .add('Mark', () => <Mark length={number('length', 5)}
      mark={boolean('disabled', false) ? 4 : undefined}
      onClick={action('onClick')} />,
  )
  .add('Slider', () =>
    <Slider>
      {[1, 2, 3, 4, 5, 6, 7].map((i) =>
        <Slider.Item key={i}>
          <Card style={{
            width: '70px',
            height: '70px',
            border: '1px solid grey',
            padding: '1px',
            marginTop: '0',
          }}>
            <Center>
              card {i}
            </Center>
          </Card>
        </Slider.Item>,
      )}
    </Slider>,
  )
  .add('tab', () => {
    const tabContent = [1, 2, 3, 4, 5].map((tab) => {
      return {
        name: 'tab' + tab,
        children: <List noBorder>
          {[1, 2, 3, 4].map((item) =>
            <List.Item key={item}>tab {tab} list-item {item}</List.Item>,
          )}
        </List>,
      };
    });
    return <Tab
      tabs={tabContent}
      onClickTab={action('onClickTab')}
    />;
  })
  .add('popup menu', () => React.createElement(class extends React.Component<{}, {showPopup:boolean}> {
    public state = {
      showPopup: true,
    };
    public render () {
      return <div>
        <div className="button"
          onClick={() => this.setState((prevState) => ({showPopup: !prevState.showPopup}))}>
          show popup
        </div>
        {this.state.showPopup && <PopupMenu
          list={[
            { title: 'one', onClick: action('clickOne')},
            { title: 'two', onClick: action('clickTwo')},
          ]}
          onClose={() => this.setState({showPopup: false})}
        />}
    </div>;
    }
  }))
  .add('animation', () => <Animate
    name={select(
      'name',
      {
        slideInUp: 'slideInUp',
        slideOutUp: 'slideOutUp',
        slideInDown: 'slideInDown',
        slideOutDown: 'slideOutDown',
        slideInRight: 'slideInRight',
        slideOutRight: 'slideOutRight',
        slideInLeft: 'slideInLeft',
        slideOutLeft: 'slideOutLeft',
      },
      'slideInUp')}
    speed={select(
      'speed',
      {
        slow: 'slow',
        slower: 'slower',
        fast: 'fast',
        faster: 'faster',
      },
      undefined)}
    infinite={boolean('infinite', false)}
    ><div>example animation</div></Animate>)
  .add('carousel', () => <Carousel
    windowResizeEvent={core.windowResizeEvent}
    slides={[
      <div> sample slide 1 </div>,
      <div> sample slide 2 </div>,
      <div> sample slide 3 </div>,
    ]}
    getIndex={action('getIndex')}
    indicator={boolean('indicator', true)}
    startIndex={number('startIndex', 0)}
  />)
  .add('Loading', () =>
    <Loading>
      <div style={{
        width: '200px',
        height: '200px',
        border: '1px solid black',
        lineHeight: '200px',
        textAlign: 'center',
      }}>
        <p> 加载中请稍后</p>
      </div>
    </Loading>,
  )
  .add('ResizableTextarea', () => (React.createElement(class extends React.Component<{}, {value:string}> {
    public state = {
      value: '',
    };
    public render () {
      return <ResizableTextarea
      maxRows={number('maxRow', 3)}
      minRows={number('minRow', 1)}
      placeholder={text('placeholder', '写回复')}
      value={this.state.value}
      onChange={(value) => this.setState({value})}/>;
    }
  })));

storiesOf('Common Components/Notice Bar', module)
  .add('short message', () => <NoticeBar
    icon={text('icon', 'fas fa-bullhorn')}
    closable={boolean('closable', true)}
    onClick={action('onClick')}
    customizeLink={(() => {
      if (boolean('customizeLink', false)) {
        return <div>go</div>;
      }
      return undefined;
    })()}
    >example notice message
  </NoticeBar>)
  .add('long message', () => <NoticeBar
    icon={text('icon', 'fas fa-bullhorn')}
    closable={boolean('closable', true)}
    onClick={action('onClick')}
  >
    example super super super super super super super super super super super super super super super super super super long notice message
  </NoticeBar>)
;

storiesOf('Common Components/Dropdown', module)
  .add('Dropwdown', () => <Dropdown
    list={[{text: '1', value: 1}, {text: '2', value: 2}]}
    onIndex={0}
    onClick={action('onClick')}
    />)
  .add('Dropdown(with title)', () => {
    return <Dropdown
      list={[{text: '1', value: 1}, {text: '2', value: 2}]}
      title={text('title', 'dropdown menu')}
      onClick={action('onClick')}
    />;
  })
;

storiesOf('Common Components/Navigation Bar', module)
  .add('simple', () => <NavBar goBack={action('goBack')} >
    {text('title', 'example title')}
  </NavBar>)
  .add('buttons', () => <NavBar goBack={action('goBack')}>
    <div className="button">阅读模式</div>
    <div className="button">论坛模式</div>
  </NavBar>)
  .add('with menu', () => React.createElement(class extends React.Component {
    public state = {
      showPopup: false,
    };
    public render () {
      return <NavBar goBack={action('goBack')}
      onMenuClick={() => this.setState({showPopup: true})}>
      {text('title', 'example title')}
      {this.state.showPopup &&
        <PopupMenu
          list={[
            {title: 'menu1', onClick: action('click menu1')},
            {title: 'menu2', onClick: action('click menu2')},
          ]}
          onClose={() => this.setState({showPopup: false})}
        />
      }
    </NavBar>;
    }
  }))
;

storiesOf('Common Components/Float Button', module)
  .add('plus', () => <FloatButton.Plus
    onClick={action('onClick')}
  />)
  .add('page', () => <div style={{ height: '1000px', position: 'relative', overflowY: 'auto' }}><FloatButton.Page
    currentPage={number('currentPage', 1)}
    totalPage={number('totalPage', 3)}
    onClick={action('onClick')}
  /></div>)
  .add('customize', () => <FloatButton>
    <div className="button">customize</div>
  </FloatButton>)
;
storiesOf('Home Components/HomePage', module)
  .add('ChannelPreview', () => React.createElement(class extends React.Component {
    public render () {
      const items = [
        {id:1, title:'春潮', brief:'我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性', author:'小山鬼'},
        {id:2, title:'stay gold', brief:'娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷娱乐圈万人迷', author:'草率'},
        {id:3, title:'英国病人', brief:'我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性我要吞下蛮荒的野兽本性', author:'小山鬼'},
    ];
      return <Router history={createBrowserHistory()}>
          <ChannelPreview
            goToThread={action('goToThread')}
            title="推荐榜单"
            threads={items}>
        </ChannelPreview>
        </Router>;
    }
  }))
  .add('tagbasicMidium', () => <TagBasic
    tagId={'233'}
    tagName={'tag'}
    onClick={(selected, selectedId) => {console.log('select', selectedId); } }
    selected={false}
    size={'medium'}
    color={'light'}
    selectedColor={'danger'}
    selectable={true}>
    </TagBasic>)
  .add('tagbasicSmall', () => <TagBasic
    tagId={'233'}
    tagName={'tag'}
    onClick={(selected, selectedId) => {console.log('select', selectedId); } }
    selected={false}
    size={'normal'}
    color={'white'}
    selectedColor={'danger'}
    selectable={true}>
  </TagBasic>)
  .add('TagBasicList1', () => React.createElement(class extends React.Component {
    public render () {
      return <div style={{
        width: '100%',
        margin: '0',
        padding: '0',
        backgroundColor:'rgba(244,245,249,1)'}}>
        <TagBasicList
          tagCategoryName={'最近搜索'}
          childTags={ [{tagId:'12', tagName:'星星'} , {tagId:'13' , tagName:'星星月亮'}]}
          tagSize={'normal'}
          tagColor={'white'}
          selectedColor={'danger'}
          showTrashbin={true}
          backgroundColor={'rgba(244,245,249,1)'}
          onClick={(selected, selectedId) => {console.log('selectedId' , selectedId); }}>
        </TagBasicList>
      </div>;
    }
  }))
  .add('TagBasicList2', () => React.createElement(class extends React.Component {
    public render () {
      return <div style={{
        width: '100%',
        margin: '0',
        padding: '0',
        backgroundColor:'rgba(244,245,249,1)'}}>
        <TagBasicList
          tagCategoryName={'热门推荐'}
          childTags={ [{tagId:'12', tagName:'得偿所愿'} , {tagId:'13' , tagName:'翅膀养护日记'}]}
          tagSize={'normal'}
          tagColor={'white'}
          selectedColor={'danger'}
          showTrashbin={false}
          backgroundColor={'rgba(244,245,249,1)'}
          onClick={(selected, selectedId) => {console.log('selectedId' , selectedId); }}>
        </TagBasicList>
      </div>;
    }
  }))
  .add('TagBasicList3', () => React.createElement(class extends React.Component {
    public render () {
      return <div style={{
        width: '100%',
        margin: '0',
        padding: '0',
        backgroundColor:'white'}}>
        <TagBasicList
          tagCategoryName={'文章分类'}
          childTags={ [{tagId:'12', tagName:'原创'} , {tagId:'13' , tagName:'同人'}]}
          tagSize={'medium'}
          tagColor={'light'}
          selectedColor={'danger'}
          showTrashbin={false}
          backgroundColor={'white'}
          onClick={(selected, selectedId) => {console.log('selectedId' , selectedId); }}>
        </TagBasicList>
      </div>;
    }
  }))
  .add('tagBasicListSelect', () => React.createElement(class extends React.Component {
    public state = {
        counter: 0,
        selectedTags: [],
    };
    public render () {
        return <TagBasicListSelect
        taglist={[{tagCatagoryName:'文章分类',
        childTags:[{tagId:'12', tagName:'原创'} , {tagId:'13' , tagName:'同人'}]},
        {tagCatagoryName:'篇幅',
        childTags:[{tagId:'14', tagName:'短篇'} , {tagId:'15' , tagName:'中篇'},
        {tagId:'16', tagName:'长篇'},{tagId:'17', tagName:'大纲'}]}
        ]}
        onBack={() => {console.log('back'); }}
        onFilter={() => {console.log('filter'); }}
        selectedCounter={this.state.counter}
        onSelect={(tags) => {
          const selectedTags = [...tags];
          this.setState({selectedTags});
          this.setState({counter:selectedTags.length});
          console.log('stearry', this.state.selectedTags);
          console.log('stearbuber', this.state.counter);
        }}
        >
        </TagBasicListSelect>;
    }
  }))
  .add('tagBasicListFilter', () => React.createElement(class extends React.Component {
    public state = {
        recentSearchTags: [],
    };
    public render () {
        return <TagBasicListFilter
        taglist={[{tagCategoryName:'最近搜索',
        categoryTrash:true,
        childTags:[{tagId:'12', tagName:'夏天'} , {tagId:'13' , tagName:'星赭'}]},
        {tagCategoryName:'热门推荐',
        categoryTrash:false,
        childTags:[{tagId:'14', tagName:'九州见闻'} , {tagId:'15' , tagName:'得偿所愿'},
        {tagId:'16', tagName:'翅膀养护日记'},{tagId:'17', tagName:'不知道写啥'}]}
        ]}
        onBack={() => {console.log('back'); }}
        onDelete={(tags) => {
          console.log('filter');
          // 1,从最近搜索标签组中删除
          const recentSearchTags = [...tags];
          this.setState({recentSearchTags});
        }}
        onFilter={ (filCriteria) => {
          // 1，加入到最近搜索
          // 2，进行搜索
          console.log('filter condition is ', filCriteria); } }
        >
        </TagBasicListFilter>;
    }
  }))
  .add('RecommendList', () => React.createElement(class extends React.Component {
    public render () {
      const items = [
        {id:1, channel_id:1, title:'夜深知雪重量', brief:'推荐语：小精灵要下山，老妖怪有交代：这世间乱得很，牵着九哥的手别放开；小精灵要下山，老妖怪有交代：这世间乱得很，牵着九哥的手别放开小精灵要下山，老妖怪有交代：这世间乱得很，牵着九哥的手别放开小精灵要下山，老妖怪有交代：这世间乱得很，牵着九哥的手别放开', author:'尸尸'},
        {id:2, channel_id:1, title:'贼雀', brief:'一二三四五六七，我们都死得很离奇；七六五四三二一，找到答案前谁都出不去', author:'叽里呱啦'},
        {id:3, channel_id:1, title:'她捡到1个放大镜', brief:'夏天夏天悄悄过去充满小秘密，放大镜的乐趣我只想告诉你', author:'越荷兮'},
    ];
      return <Router history={createBrowserHistory()}>
          <RecommendList
          taglist={[{tagCatagoryName:'文章分类',
          childTags:[{tagId:'12', tagName:'原创'} , {tagId:'13' , tagName:'同人'}]},
          {tagCatagoryName:'篇幅',
          childTags:[{tagId:'14', tagName:'长篇'} , {tagId:'15' , tagName:'中篇'},
          {tagId:'16', tagName:'短篇'},{tagId:'17', tagName:'大纲'}]}
          ]}
          threads={items}
          onBack={() => {}}
          onSearch={() => {}}
          onShowTags={() => {}}>
        </RecommendList>
        </Router>;
    }
  }))
;
storiesOf('Home Components', module)
;

storiesOf('User Components', module)
;

storiesOf('Thread Components', module)
  .add('list preview', () => <Card>
    <ThreadPreview
      mini={boolean('mini', false)}
      data={{
        type: 'thread',
        id: 1,
        attributes: {
          title: randomCnWords(number('title', 20), 0.15),
          brief: randomCnWords(number('brief', 40), 0.2),
          view_count: number('view', 200),
          reply_count: number('reply', 40),
          channel_id: 1,
        },
        last_post: {
          type: 'post',
          id: 1,
          attributes: {
            title: randomCnWords(number('post title', 40), 0.2),
            body: '',
          },
        },
        author: {
          id: 1,
          attributes: {
            name: randomCnWords(number('author name', 3), 0),
          },
          type: 'user',
        },
        tags: [
          {
            type: 'tag',
            id: 1,
            attributes: {
              tag_name: '日常闲聊',
              tag_type: '',
            },
          },
        ],
      }}
      onTagClick={action('toChannelTag')}
      onClick={action('onClick')}
      onUserClick={action('onUserClick')}
    />
  </Card>)
;

storiesOf('Message Components', module)
  .add('chatBubble', () =>
    (<div style={{'width':'100%', 'height':'100%', 'background':'#f4f5f9', 'padding':'30px'}}>
      <ChatBubble fromMe={boolean('fromMe', false)} content={text('content', 'This is a chat bubble!')}></ChatBubble>
    </div>))
  .add('Expandable Message', () => {
    const content =
    `今日，系统查封了大批共享账号。
    其中，对于一些有被盗嫌疑的共享账号，系统进行了保护性的临时禁封。
    这些账号不一定是注册者恶意共享，而是被攻击者通过撞库盗号后，盗号者不做任何改动，便将账号密码贩卖出去，从而进行多人共享。
    也就是说，在原主人不知道的情况下，该账号被偷偷地、反复地使用。
    因此，系统会定时对多人异地使用、行为异常的账户进行封禁。
    为了避免这种情况，避免被系统禁封，请使用了简单密码的用户早日更换为在别处不经常使用的密码，增加账号安全。
    废文禁止盗号，禁止任何形式的账户买卖，买号者付出的金钱，正是攻击者攻击网站的动力。
    
    没有买卖就没有攻击。`;
    const title = '没有买卖就没有攻击';
    const footer = '废文网大内总管 2019-10-29 18:03:54';
    return (<ExpandableMessage title={text('title', title)} content={text('content', content)} footer={footer} uid={'1'} boldTitle={boolean('bold title', false)}></ExpandableMessage>);
  })
;

storiesOf('Status Components', module)
;

storiesOf('Collection Components', module)
;