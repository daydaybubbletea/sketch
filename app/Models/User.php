<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Notifications\ResetPasswordNotification;
use DB;
use Carbon;
use Cache;
use CacheUser;
use ConstantObjects;

class User extends Authenticatable
{
    use Notifiable;
    use Traits\QiandaoTrait;

    protected $dates = ['deleted_at', 'qiandao_at'];
    public $timestamps = false;

    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = [
        'name', 'email', 'password', 'title_id', 'unread_updates', 'unread_reminders', 'public_notice_id'
    ];

    /**
    * The attributes that should be hidden for arrays.
    *
    * @var array
    */
    protected $hidden = [
        'password', 'email', 'remember_token',
    ];

    public static function boot()
    {
        parent::boot();
    }
    /**
    * Send the password reset notification.
    *
    * @param  string  $token
    * @return void
    */
    //overriding existing sendpassword reset notification
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function title()
    {
        return $this->belongsTo(Title::class, 'title_id');
    }

    public function titles()
    {
        return $this->belongsToMany(Title::class, 'title_user', 'user_id', 'title_id')->withPivot('is_public');
    }

    public function branchaccounts()
    {
        return $this->belongsToMany(User::class, 'linkaccounts', 'master_account', 'branch_account');
    }

    public function masteraccounts()
    {
        return $this->belongsToMany(User::class, 'linkaccounts', 'branch_account', 'master_account');
    }

    public function statuses()
    {
        return $this->hasMany(Status::class);
    }

    public function info()
    {
        return $this->hasOne(UserInfo::class, 'user_id');
    }

    public function intro()
    {
        return $this->hasOne(UserIntro::class, 'user_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    public function followings()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }

    public function homeworks()
    {
        return $this->belongsToMany(Homework::class, 'homework_registrations', 'homework_id', 'user_id');
    }

    public function collections()
    {
        return $this->belongsToMany(Thread::class, 'collections', 'user_id', 'thread_id');
    }

    public function groups()
    {
        return $this->hasMany(CollectionGroup::class, 'user_id');
    }

    public function follow($user_ids)
    {
        if (!is_array($user_ids)){
            $user_ids = compact('user_ids');
        }
        $this->followings()->sync($user_ids, false);
    }
    public function unfollow($user_ids)
    {
        if (!is_array($user_ids)){
            $user_ids = compact('user_ids');
        }
        $this->followings()->detach($user_ids);
    }

    public function isFollowing($user_id)
    {
        return $this->followings->contains($user_id);
    }


    public function isAdmin()
    {
        return $this->role==='admin';
    }

    public function isEditor()
    {
        return $this->role==='editor';
    }

    public function seeHomework()
    {
        return $this->role==='admin'||$this->role==='editor'||$this->role==='senior';
    }

    public function canSeeChannel($id)
    {
        $channel = collect(config('channel'))->keyby('id')->get($id);
        return $channel->is_public||$this->role==='admin'||($channel->type==='homework'&&$this->role==='editor')||($channel->type==='homework'&&$this->role==='senior')||($channel->type==='homework'&&$this->role==='homeworker');
    }

    public function checklevelup()
    {
        $level_ups = config('level.level_up');
        $info = $this->info;
        foreach($level_ups as $level=>$requirement){
            if (($this->level < $level)
            &&(!(array_key_exists('salt',$requirement))||($requirement['salt']<=$info->jifen))
            &&(!(array_key_exists('fish',$requirement))||($requirement['fish']<=$info->xianyu))
            &&(!(array_key_exists('ham',$requirement))||($requirement['ham']<=$info->sangdian))
            &&(!(array_key_exists('qiandao_all',$requirement))||($requirement['qiandao_all']<=$info->qiandao_all))
            &&(!(array_key_exists('quiz_level',$requirement))||($requirement['quiz_level']<=$user->quiz_level))){
                $this->level = $level;
                $this->save();
                return true;
            }
        }
        return false;
    }

    public function reward($kind, $base = 0){
        return $this->info->reward($kind, $base);
    }

    public function isOnline()
    {
        return Cache::has('usr-on-' . $this->id);
    }

    public function wearTitle($title_id)
    {
        $this->update([
            'title_id' => $title_id,
        ]);
    }

    public function active_now($ip)
    {
        $this->info->active_now($ip);
    }


    public function clear_column($column_name='')
    {
        switch ($column_name) {
            case 'unread_reminders':
                if($this->unread_reminders>0){
                    $this->update(['unread_reminders'=>0]);
                }
            return true;
            break;

            case 'unread_updates':
                if($this->unread_updates>0){
                    $this->update(['unread_updates'=>0]);
                }
            return true;
            break;

            case 'public_notice_id':
                if($this->public_notice_id<ConstantObjects::system_variable()->latest_public_notice_id){
                    $this->update(['public_notice_id'=>ConstantObjects::system_variable()->latest_public_notice_id]);
                }
            return true;
            break;

            default:
            return false;
        }
    }

    public function unread_reminder_count()
    {
        return $this->unread_reminders
        + ConstantObjects::system_variable()->latest_public_notice_id
        - $this->public_notice_id;
    }

    public function linked($user_id)
    {
        return $this->branchaccounts->contains($user_id);
    }

    public function remind($reminder='')
    {
        $info = CacheUser::info($this->id);
        switch ($reminder) {
            case 'new_message':
                $this->unread_reminders +=1;
                $info->message_reminders += 1;
            break;

            case 'new_reply':
                $this->unread_reminders +=1;
                $info->reply_reminders +=1;
            break;

            case 'new_reward':
                $this->unread_reminders +=1;
                $info->reward_reminders +=1;
            break;

            case 'new_upvote':
                $this->unread_reminders +=1;
                $info->upvote_reminders +=1;
            break;

            default:
            return false;
        }
        $info->save();
        $this->save();
        return true;
    }

    public function created_new_post($post)
    {
        if(!$post){return;}

        if($this->use_indentation!=$this->use_indentation){
            $this->use_indentation=$this->use_indentation;
        }
        if($post->is_anonymous&& $this->majia!=$post->majia){
            $this->majia=$post->majia;
        }

        $this->save();
    }



}
