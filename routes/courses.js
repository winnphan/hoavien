const express = require('express'),
    {
        getCourses,
        getCourse,
        addCourse,
        updateCourse,
        deleteCourse
    } = require('../controller/courses'),
    router = express.Router({mergeParams: true});

router.route('/').get(getCourses).post(addCourse);
router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
