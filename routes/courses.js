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

const { protect } = require('../middleware/auth');

router.route('/')
    .get(
        advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getCourses
    )
    .post(protect, addCourse);
router
    .route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;
