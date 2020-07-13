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

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(
        advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getCourses
    )
    .post(protect, authorize('publisher', 'admin'), addCourse);
router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
