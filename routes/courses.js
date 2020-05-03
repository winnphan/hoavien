const express = require('express'),
    {
        getCourses,
        getCourse,
        addCourse,
        updateCourse,
        deleteCourse
    } = require('../controller/courses'),
    Course = require('../models/Course'),
    advancedResults = require('../middleware/advancedResults'),
    router = express.Router({mergeParams: true});



router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description'
    }), getCourses)
    .post(addCourse);
router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
