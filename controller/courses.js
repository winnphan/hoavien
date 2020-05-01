const ErrorResponse = require('../utils/errorRespone'),
    asyncHandler = require('../middleware/async'),
    Course = require('../models/Course');

// @desc        Get courses
// @route       Get /api/v1/courses
// @route       Get /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find();
    }

    const courses = await query;

    res.status(200).json({
        success: 200,
        count: courses.length,
        data: courses
    });
});
