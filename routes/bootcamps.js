const express = require('express'),
    {
        getBootcamps,
        getBootcamp,
        createBootcamp,
        updateBootcamp,
        deleteBootcamp
    } = require('../controller/bootcamps'),
    router = express.Router();

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;