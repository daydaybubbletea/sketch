<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
    use Traits\VoteTrait;
    use Traits\RewardTrait;
    use Traits\TypeValueChangeTrait;

    protected $guarded = [];
    protected $post_types = array('chapter', 'question', 'answer', 'request', 'post', 'comment', 'review'); // post的分类类别
    protected $reward_types = [];

    const UPDATED_AT = null;

    protected $hidden = [
        'creation_ip',
    ];

    protected $dates = ['deleted_at', 'edited_at', 'created_at', 'responded_at'];

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function simpleThread()
    {
        return $this->belongsTo(Thread::class, 'thread_id')->select('id','channel_id','title','brief');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function last_reply()
    {
        return $this->belongsTo(Post::class, 'last_reply_id')->select(['id','brief']);
    }

    public function replies()
    {
        return $this->hasMany(Post::class, 'reply_to_id');
    }

    public function answers()
    {
        return $this->hasMany(Post::class, 'reply_to_id')->where('type','=','answer');
    }

    public function question()
    {
        return $this->belongsTo(Post::class, 'reply_to_id')->where('type','=','question');
    }

    public function parent()
    {
        return $this->belongsTo(Post::class, 'reply_to_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id','name','title_id','level');
    }

    public function chapter()
    {
        return $this->hasOne(Chapter::class, 'post_id');
    }
    public function review()
    {
        return $this->hasOne(Review::class, 'post_id');
    }

    public function tags()
    {
        return $this->belongsToMany('App\Models\Tag', 'tag_post', 'post_id', 'tag_id');
    }

    public function scopeBrief($query)
    {
        return $query->select('id', 'user_id', 'title', 'type', 'brief', 'created_at',  'edited_at',  'is_bianyuan', 'upvote_count', 'reply_count', 'char_count', 'view_count');
    }

    public function scopeUserOnly($query, $userOnly)
    {
        if($userOnly){
            return $query->where('user_id', $userOnly)->where('is_anonymous', false);
        }
        return $query;
    }

    public function scopeWithType($query, $withType)
    {
        if(in_array($withType, $this->post_types)){
            return $query->where('type', $withType);
        }
        return $query;
    }

    public function scopeWithComponent($query, $withComponent)
    {
        if($withComponent==='component_only'){
            return $query->whereIn('type', array_diff( $this->post_types, ['post','comment']));
        }
        if($withComponent==='none_component_only'){
            return $query->whereIn('type',['post','comment']);
        }
        return $query;
    }

    public function scopeWithReplyTo($query, $withReplyTo)
    {
        if($withReplyTo){
            return $query->where('reply_to_id', $withReplyTo);
        }
        return $query;
    }

    public function scopeOrdered($query, $ordered='')
    {
        switch ($ordered) {
            case 'latest_created'://最新
            return $query->orderBy('created_at', 'desc');
            break;
            case 'most_replied'://按回应数量倒序
            return $query->orderBy('reply_count', 'desc');
            break;
            case 'most_upvoted'://按赞数倒序
            return $query->orderBy('upvote_count', 'desc');
            break;
            case 'random'://随机排序
            return $query->inRandomOrder();
            break;
            case 'latest_responded'://按最新被回应时间倒序
            return $query->orderBy('responded_at', 'desc');
            break;
            default://默认按时间顺序排列，最早的在前面
            return $query->orderBy('created_at', 'asc');
        }
    }
    public function scopeReviewThread($query, $thread_id)
    {
        if($thread_id){
            $query = $query->where('reviews.thread_id', $thread_id);
        }else{
            return $query;
        }
    }

    public function scopeReviewRecommend($query, $withRecommend)
    {
        if($withRecommend==='recommend_only'){
            return $query->where('reviews.recommend', true);
        }
        if($withRecommend==='none_recommend_only'){
            return $query->where('reviews.recommend', false);
        }
        return $query;
    }

    public function scopeReviewEditor($query, $withEditor)
    {
        if($withEditor==='editor_only'){
            return $query->where('reviews.editor_recommend', true);
        }
        if($withEditor==='none_editor_only'){
            return $query->where('reviews.editor_recommend', false);
        }
        return $query;
    }

    public function scopeReviewMaxRating($query, $withMaxRating)
    {
        if($withMaxRating){
            return $query->where('reviews.rating', '<=', $withMaxRating);
        }else{
            return $query;
        }
    }

    public function scopeReviewMinRating($query, $withMinRating)
    {
        if($withMinRating){
            return $query->where('reviews.rating', '>=', $withMinRating);
        }else{
            return $query;
        }
    }

    public function scopeReviewLong($query, $withLong)
    {
        if($withLong==='long_only'){
            return $query->where('reviews.long', true);
        }
        if($withLong==='short_only'){
            return $query->where('reviews.long', false);
        }
        return $query;
    }

    public function scopeReviewOrdered($query, $ordered)
    {
        switch ($ordered) {
            case 'latest_created'://最新
            return $query->orderBy('posts.created_at', 'desc');
            break;
            case 'most_replied'://按回应数量倒序
            return $query->orderBy('posts.reply_count', 'desc');
            break;
            case 'most_upvoted'://按赞数倒序
            return $query->orderBy('posts.upvotes', 'desc');
            break;
            case 'latest_responded'://按最新被回应时间倒序
            return $query->orderBy('posts.responded_at', 'desc');
            break;
            case 'random'://随机排序
            return $query->inRandomOrder();
            break;
            case 'oldest_created'://按最新被回应时间倒序
            return $query->orderBy('posts.created_at', 'asc');
            break;
            default:
            return $query->orderBy('reviews.redirects', 'desc');
            break;
        }
    }

    public function scopePostInfo($query)
    {
        return $query->select('id', 'type', 'user_id', 'thread_id', 'title', 'brief', 'created_at', 'is_bianyuan', 'char_count', 'view_count', 'reply_count', 'upvote_count');
    }


    public function favorite_reply()//这个post里面，回复它的postcomment中，最多赞的
    {
        return Post::where('reply_to_id', $this->id)
        ->with('author.title')
        ->orderBy('upvote_count', 'desc')
        ->first();
    }

    public function newest_reply()//这个post里面，回复它的postcomment中，最新的一个，全部内容
    {
        return Post::where('reply_to_id', $this->id)
        ->with('author.title')
        ->orderBy('created_at', 'desc')
        ->first();
    }

    public function checklongcomment()
    {
        if($this->char_count>config('constants.longcomment_length')){
            $this->user->reward('long_post');
            return true;
        }
        return false;
    }

    public function latest_rewards()
    {
        return \App\Models\Reward::with('author')
        ->withType('post')
        ->withId($this->id)
        ->orderBy('created_at','desc')
        ->take(10)
        ->get();
    }

}
