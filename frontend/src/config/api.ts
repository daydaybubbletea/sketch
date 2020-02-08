import { Database } from './database';

export type Timestamp = string;
export type Token = string;
export type UInt = number;
export type Increments = number;

export namespace ResData {
  export interface Quote {
    type:'quote';
    id:number;
    attributes:{
      body:string;
      user_id?:Increments;
      is_anonymous?:boolean;
      majia?:string;
      not_sad?:boolean;
      is_approved?:boolean;
      reviewer_id?:Increments;
      xianyu?:number;
      created_at?:Timestamp;
    };
    author:User;
  }

  export function allocQuote () {
    return {
      type: 'quote',
      id: 0,
      attributes: {
        body: '',
      },
      author: allocUser(),
    };
  }

  export interface User {
    type:'user';
    id:number;
    attributes:Database.UserDefault;
    followInfo?:{
      keep_updated:boolean;
      is_updated:boolean;
    };
  }

  export function allocUser () : User {
    return {
      type: 'user',
      id: 0,
      attributes: {
        name: '',
      },
    };
  }

  export interface Channel {
    type:'channel';
    id:number;
    attributes:Database.Channel;
  }

  export interface Thread {
    type:'thread';
    id:number;
    attributes:Database.Thread;
    author:User;
    channel?:Channel;
    tags?:Tag[];
    recommendations?:Recommendation[];
    last_component?:Post;
    last_post?:Post;
  }

  export function allocThread () : Thread {
    return {
      type: 'thread',
      id: 0,
      attributes: {
        title: '',
        channel_id: 0,
      },
      author: allocUser(),
    };
  }

  export interface Status {
    type:'status';
    id:number;
    attributes:Database.Status;
    author:User;
  }

  export interface Tag {
    type:'tag';
    id:number;
    attributes:Database.Tag;
  }

  export interface ThreadPaginate {
    total:number;
    count:number;
    per_page:number;
    current_page:number;
    total_pages:number;
  }

  export function allocThreadPaginate () : ThreadPaginate {
    return {
      total: 1,
      count: 1,
      per_page: 1,
      current_page: 1,
      total_pages: 1,
    };
  }

  export interface Post {
    type:'post';
    id:number;
    attributes:Database.Post;
    author?:User;
    review?:Review;
    answer?:Thread;
    chapter?:Chapter;
  }

  export function allocPost () : Post {
    return {
      type: 'post',
      id: 0,
      attributes: {
        body: '',
      },
    };
  }

  export interface Review {
    type:'review';
    id:number;
    attributes:{};
    reviewee:Database.Thread;
  }

  export function allocReview () {
    return {
      type: 'review',
      id: 0,
      attributes: {},
      reviewee: allocThread(),
    };
  }

  export interface Recommendation {
    type:'recommendation';
    id:number;
    attributes:{
      brief:string;
      body:string;
      type:'long'|'shot';
      created_at:Database.Timestamp;
    };
    authors:User[];
  }

  export interface Chapter {
    type:'chapter';
    id:number;
    attributes:Database.Chapter;
  }

  export function allocChapter () : Chapter {
    return {
      type: 'chapter',
      id: 0,
      attributes: {

      },
    };
  }

  export interface Volumn {
    type:'volumn';
    id:number;
    attributes:Database.Volume;
  }

  export interface Date {
    date:Timestamp;
    timezone_type:number;
    timezone:string;
  }

  export interface Message {
    type:'message';
    id:number;
    attributes:{
      poster_id:number;
      receiver_id:number;
      body_id:number;
      created_at:Timestamp;
      seen:boolean;
    };
    poster?:User;
    message_body?:MessageBody;
    receiver?:User;
  }

  export interface MessageBody {
    type:'message_body';
    id:number;
    attributes:{
      body:string;
      bulk:boolean;
    };
  }

  export function allocMessage () : Message {
    return {
      type: 'message',
      id: 0,
      attributes: {
        poster_id: 0,
        receiver_id: 0,
        body_id: 0,
        created_at: '',
        seen: false,
      },
      poster: allocUser(),
      receiver: allocUser(),
      message_body: allocMessageBody(),
    };
  }

  export function allocMessageBody () : MessageBody {
    return {
      type: 'message_body',
      id: 0,
      attributes: {
          body: '',
          bulk: false,
      },
    };
  }

  export interface PublicNotice {
    type:'public_notice';
    id:number;
    attributes:{
      user_id:number;
      title:string;
      body:string;
      created_at:Timestamp;
      edited_at:Timestamp;
    };
    author?:User;
  }
  export function allocPublicNotice () : PublicNotice {
    return {
      type: 'public_notice',
      id: 0,
      attributes: {
        user_id: 0,
        title: '',
        body: '',
        created_at: '',
        edited_at: '',
      },
      author: allocUser(),
    };
  }

  export interface Title {
    type:'title';
    id:number;
    attributes:{
      name:string;
      description:string;
      user_count:number;
      style_id:number;
      type:string;
      level:number;
      style_type:string;
    };
  }
  export function allocTitle () : Title {
    return {
      type: 'title',
      id: 0,
      attributes: {
        name: '',
        description: '',
        user_count: 0,
        style_id:0,
        type:'',
        level:0,
        style_type:'',
      },
    };
  }
  export interface Vote {
    type:'vote';
    id:number;
    attributes:{
      votable_type:ReqData.Vote.type;
      votable_id:number;
      attitude:ReqData.Vote.attitude;
      created_at:Timestamp;
    };
    author:User;
  }
  export interface Collection {
    type:'collection';
    id:number;
    attributes:{
      user_id:number;
      thread_id:number;
      keep_updated:boolean;
      updated:boolean;
      group_id:number;
      last_read_post_id:number;
    };
  }
  export interface CollectionGroup {
    type:'collection_group';
    id:number;
    attributes:{
      user_id:number;
      name:string;
      update_count:number;
      order_by:number;
    };
  }
}

export namespace ReqData {
  export namespace Thread {
    export enum ordered {
      latest_added_component = 'latest_added_component', //按最新更新时间排序
      jifen = 'jifen',  //按总积分排序
      weighted_jifen = 'weighted_jifen', //按平衡积分排序
      latest_created = 'latest_created', //按创建时间排序
      id = 'id',  //按id排序
      collection_count = 'collection_count', //按收藏总数排序
      total_char = 'total_char', //按总字数排序
    }
    // （是否仅返回边缘/非边缘内容）
    export enum withBianyuan {
      bianyuan_only = 'bianyuan_only',
      none_bianyuan_only = 'none_bianyuan_only',
    }

    export enum withType {
      thread = 'thread',
      book = 'book',
      list = 'list', //收藏单
      column = 'column',
      request = 'request',
      homework = 'homework',
    }
  }

  export namespace Message {
    export enum style {
      sendbox = 'sendbox',
      receiveBox = 'receivebox',
      dialogue = 'dialogue',
    }

    export enum ordered {
      oldest,
      latest,
    }

    export enum read {
      read_only,
      unread_only,
    }
  }

  export namespace Collection {
    export enum type {
      thread = 'thread',
      book = 'book',
      list = 'list',
      request = 'request',
      homework = 'homework',
    }
  }

  export namespace Title {
    export enum status {
      hide = 'hide',
      public = 'public',
      wear = 'wear',
    }
  }

  export namespace Vote {
    export enum type {
      post = 'Post',
      quote = 'Quote',
      status = 'Status',
      thread = 'Thread',
    }
    export enum attitude {
      upvote = 'upvote',
      downvote = 'downvote',
      funnyvote = 'funnyvote',
      foldvote = 'foldvote',
    }
  }

  export namespace Post {
    export enum withType {
      post = 'post',
      comment = 'comment',
      chapter = 'chatper',
      review = 'review',
    }
    export enum withComponent {
      component_only = 'component_only',
      none_component_only = 'none_component_only',
    }
    export enum ordered {
      latest_created = 'latest_created',
      most_replied = 'most_replied',
      most_upvoted = 'most_upvoted',
      latest_responded = 'latest_responded',
      random = 'random',
    }
  }
}

export namespace API {
  export interface Get {
    '/':{
      quotes:ResData.Quote[],
      recent_recommendations:ResData.Post[],
      homeworks:ResData.Thread[],
      channel_threads:ResData.Thread[],
    };
    '/homethread':{
      [idx:string]:{
        channel:ResData.Channel,
        threads:ResData.Thread[],
      },
    };
    '/homebook':{
      recent_long_recommendations:ResData.Post[],
      recent_short_recommendations:ResData.Post[],
      random_short_recommendations:ResData.Post[],
      recent_custom_short_recommendations:ResData.Post[],
      recent_custom_long_recommendations:ResData.Post[],
      recent_added_chapter_books:ResData.Thread[],
      recent_responded_books:ResData.Thread[],
      highest_jifen_books:ResData.Thread[],
      most_collected_books:ResData.Thread[],
    };
    '/user/$0/following':{
      user:ResData.User,
      followings:ResData.User[],
      paginate:ResData.ThreadPaginate,
    };
    '/user/$0/followingStatuses':{
      user:ResData.User,
      followingStatuses:ResData.User[],
      paginate:ResData.ThreadPaginate,
    };
    '/user/$0/follower':{
      user:ResData.User,
      followers:ResData.User[],
      paginate:ResData.ThreadPaginate,
    };
    '/user/$0/message':{
      messages:ResData.Message[],
      paginate:ResData.ThreadPaginate,
      style:ReqData.Message.style,
    };
    '/publicnotice':{
      public_notices:ResData.PublicNotice[],
    };
    '/config/titles':{
      titles:ResData.Title[],
    };
    '/user/$0/title':{
      user:ResData.User,
      titles:ResData.Title[],
      paginate:ResData.ThreadPaginate,
    };
    '/vote':{
      votes:ResData.Vote[],
      paginate:ResData.ThreadPaginate,
    };
    '/thread':{
      threads:ResData.Thread[],
      paginate:ResData.ThreadPaginate,
    };
    '/thread/$0':{
      thread:ResData.Thread,
      posts:ResData.Post[],
      paginate:ResData.ThreadPaginate,
    };
    '/thread/$0/post':{
      thread:ResData.Thread,
      posts:ResData.Post[],
      paginate:ResData.ThreadPaginate,
    };
    '/book/$0':{
      thread:ResData.Thread,
      chapters:ResData.Post[],
      paginate:ResData.ThreadPaginate,
      most_upvoted:ResData.Post,
      top_review:null|ResData.Post,
    };
    '/collection':{ // fixme: need check
      threads:ResData.Thread[],
      paginate:ResData.ThreadPaginate,
    };
    '/config/noTongrenTags':ResData.Tag[]; // fixme:
  }

  export interface Post {
    '/user/$0/follow':{
      user:ResData.User,
    };
    '/message':{
      message:ResData.Message,
    };
    '/groupmessage':{
      messages:ResData.Message[],
    };
    '/publicnotice':{
      public_notice:ResData.PublicNotice,
    };
    '/vote':ResData.Vote;
    '/thread/$0/chapter':any; //fixme:
    '/thread/$0/collect':ResData.Collection;
    '/register':{
      token:string;
      name:string;
      id:number;
    };
    '/login':{
      token:string;
      name:string;
      id:number;
    };
    '/quote':any; //fixme:
  }

  export interface Patch {
    '/user/$0/follow':ResData.User;
    '/thread/$0/post/$1/turnToPost':ResData.Post;
    '/thread/$0/synctags':{tags:number[]};
    '/user/$0/title/$1':{
      user:ResData.User,
      title:ResData.Title,
    };
  }

  export interface Delete {
    '/user/$0/follow':{
      user:ResData.User,
    };
    '/vote/$0':string;
  }

  export interface Put {

  }
}
