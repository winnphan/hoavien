const express = require('express'),
    {
        getCourses
    } = require('../controller/courses'),
    router = express.Router({mergeParams: true});

router.route('/').get(getCourses);

module.exports = router;
