<?php
class UserStateModel extends BaseModel {
    
    protected function getTable() {
        return 'user_state';
    }

    public function getFields() {
        return [
            'id' => [
                'type' => 'hidden',
                'dbtype' => 'i'
            ],
            'user_id' => [
                'label' => 'user_id',
                'dbtype' => 'i'
            ],
            'title' => [
                'label' => 'title',
                'dbtype' => 's'
            ],
            'score' => [
                'label' => 'score',
                'dbtype' => 'i'
            ],
            'data' => [
                'label' => 'data',
                'dbtype' => 's'
            ]
        ];
    }

    public function getLeaders($count = 10, $source='vk') {
        GLOBAL $dbp;

        $admins = implode(', ', DEVUSERS);

        $query = "SELECT u.id, us.title, us.score, u.first_name, u.last_name, u.username, JSON_UNQUOTE(JSON_EXTRACT(u.data, '$.photo_100')) as avatar FROM ".
        "`user_state` us LEFT JOIN `users` u ON us.user_id = u.id ".
        "WHERE us.user_id NOT IN ({$admins}) AND u.source='{$source}' ORDER BY us.title DESC, us.score DESC LIMIT {$count}";

        return $dbp->asArray($query);
    }
}
?>