@foreach ($donation_records as $record)
<div class="row h5">
    <div class="">
        <span class="badge bianyuan-tag badge-tag">{{$record->donation_kind}}</span>
        <span class="badge newchapter-badge badge-tag {{$record->is_claimed? '':'hidden'}}">已关联</span>
        <span class="">{{StringProcess::mask_email($record->donation_email)}}</span>
        <span>
            「
            @if($record->user_id===0)
            '未知Patreon赞助人'
            @else
            @if($record->is_anonymous)
            {{$record->donation_majia??'匿名咸鱼'}}
            @elseif($record->author)
            <a href="{{ route('user.show', $record->user_id) }}">{{ $record->author->name }}</a>
            @endif
            @endif
            」
        </span>
        <span>
            {{$record->show_amount? '$'.$record->donation_amount:'赞助者不想展示金额信息'}}
        </span>
        <span>
            {{$record->donated_at? $record->donated_at->diffForHumans():''}}
        </span>
        @if($record->donation_message)
        <span>留言：
            {{$record->donation_message}}
        </span>
        @endif
    </div>
</div>
@endforeach
