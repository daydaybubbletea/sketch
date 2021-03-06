<?php
namespace App\Sosadfun\Traits;

use DB;
use Cache;
use App\Models\Quiz;
use App\Models\QuizOption;

trait QuizObjectTraits{

    public static function random_quizzes($level=-1, $quizType='', $number=5)
    {
        return Cache::remember('random_quizzes'.'|level:'.$level.'|type:'.$quizType.'|number:'.$number, 3, function () use ($level, $quizType, $number) {
            return Quiz::withQuizLevel($level)
            ->withQuizType($quizType)
            ->isOnline()
            ->inRandomOrder()
            ->take($number)->get();
        });
    }

    public static function all_quiz_answers()
    {
        return Cache::remember('all_quiz_answers', 20, function() {
            return DB::table('quiz_options')->select('id', 'quiz_id', 'is_correct')->get();
        });
    }

    public static function find_quiz_set($quiz_id)
    {
        return Cache::remember('quiz-'.$quiz_id, 20, function() use($quiz_id) {
            $quiz = Quiz::with('quiz_options')->find($quiz_id);
            return $quiz;
        });
    }

    /**
     * Check whether submitted quiz is passed or not.
     * @param mixed $quizzes an array with quizzes' id and user's answer
     * @param mixed $recorded_questions question_ids recorded that should be answered
     * @param int $number_to_pass How many questions have to be correct
     * @return bool true if passed, false if not passed
     */
    public static function check_quiz_passed_or_not($quizzes, $recorded_questions ,int $number_to_pass)
    {
        // 开始核对题目和答案
        $correct_quiz_number = 0;
        $submitted_quiz_ids = [];
        if (!$quizzes || !is_array($quizzes)) {
            abort(422, '请求数据格式有误。');
        }
        if (!$recorded_questions) {
            abort(444, '回答的题目和数据库中应该回答的题不符合。');
        }

        $counter = [
            "quiz_count" => [],
            "correct_count" => [],
            "select_count" => []
        ];
        foreach ($quizzes as $quiz) {
            if (!is_array($quiz) || !array_key_exists('id', $quiz) || !array_key_exists('answer', $quiz) || !is_int($quiz['id']) || !$quiz['answer']) {
                abort(422, '请求数据格式有误。');
            }
            $submitted_quiz_ids[] = $quiz['id'];
            $correct_quiz_number += self::is_answer_correct($quiz['id'],$quiz['answer'],$counter);
        }

        // 检查答的题目是不是数据库中记录的题目
        $expected_quiz_ids = array_map('intval', explode(',', $recorded_questions));
        sort($expected_quiz_ids);
        sort($submitted_quiz_ids);
        if ($expected_quiz_ids != $submitted_quiz_ids) {
            abort(444, '回答的题目和数据库中应该回答的题不符合。');
        }

        self::perform_counter($counter);
        return $correct_quiz_number >= $number_to_pass;
    }

    /**
     * @param int $id The quiz_id
     * @param string $answer The answer user submitted
     * @param array $counter The counter
     * @return bool Whether the answer is correct or not
     */
    public static function is_answer_correct(int $id, string $answer, array &$counter) {
        $quiz = self::find_quiz_set($id);
        if (!$quiz) {
            abort(444, '回答的题目和数据库中应该回答的题不符合。');
        }
        $possible_answers = $quiz->quiz_options;
        $correct_answers = $possible_answers->where('is_correct',true)->pluck('id')->toArray();
//        $quiz->delay_count('quiz_count', 1);
        self::update_counter($counter, 'quiz_count', $id);
        $user_answers = array_map('intval', explode(',', $answer));
        sort($correct_answers);
        sort($user_answers);

        // 如果用户的选项存在不是本题的所有选项的话
        if (!empty(array_diff($user_answers,$possible_answers->pluck('id')->toArray()))) {
            abort(422, '请求数据有误。');
        }
        // 统计每一个选项被选择的次数
        foreach ($user_answers as $user_answer) {
            if ($user_answer <= 0) {
                abort(422, '请求数据格式有误。');
            }
            $option = QuizOption::find($user_answer);
//            $option->delay_count('select_count', 1);
            self::update_counter($counter, 'select_count', $user_answer);
        }
        if ($correct_answers == $user_answers) {
//            $quiz->delay_count('correct_count', 1);
            self::update_counter($counter, 'correct_count', $id);
            return true;
        }
        return false;
    }

    /**
     * @param array $counter The counter
     * @param string $type 'quiz_count', 'correct_count' or 'select_count'
     * @param int $id quiz_id or option_id
     */
    public static function update_counter(array &$counter, string $type, int $id) {
        if (array_key_exists($id,$counter[$type])) {
            $counter[$type][$id] += 1;
        } else {
            $counter[$type][$id] = 1;
        }
    }

    /**
     * @param array $counter The counter
     */
    public static function perform_counter(array &$counter) {
        foreach ($counter['quiz_count'] as $id => $value) {
            $quiz = self::find_quiz_set($id);
            $quiz->delay_count('quiz_count', $value);
        }
        foreach ($counter['correct_count'] as $id => $value) {
            $quiz = self::find_quiz_set($id);
            $quiz->delay_count('correct_count', $value);
        }
        foreach ($counter['select_count'] as $id => $value) {
            $option = QuizOption::find($id);
            $option->delay_count('select_count', $value);
        }
    }

}
