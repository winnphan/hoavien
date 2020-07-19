const express = require('express'),
    {
        getReviews,
        getReview
    } = require('../controller/review'),
    Review = require('../models/Review'),
    router = express.Router({mergeParams: true}),
    advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(
        advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getReviews
    );

router
    .route('/:id').get(getReview);

module.exports = router;
