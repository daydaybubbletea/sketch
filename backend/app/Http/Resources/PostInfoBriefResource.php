<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostInfoBriefResource extends JsonResource
{
    /**
    * Transform the resource into an array.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return array
    */
    public function toArray($request)
    {
        $reviewee = new ThreadBriefResource($this->whenLoaded('reviewee'));
        return [
            'type' => 'post_info',
            'id' => (int) $this->post_id,
            'attributes' => [
                'order_by' => (int)$this->order_by,
                'abstract' => (string)$this->abstract,
                'previous_id' => (int)$this->previous_chapter_id,
                'next_id' => (int)$this->next_chapter_id,
                'reviewee_id' => (int)$this->reviewee_id,
                'reviewee_type' => (string)$this->reviewee_type,
                'recommend' => (bool)$this->recommend,
                'editor_recommend' => (bool)$this->editor_recommend,
                'rating' => (int)$this->rating,
                'redirect_count' => (int)$this->redirect_count,
                'author_attitude' => (int)$this->author_attitude,
            ],
            'reviewee' => $reviewee,
        ];
    }
}
