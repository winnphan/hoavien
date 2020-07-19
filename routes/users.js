const express = require('express'),
    {
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser
    } = require('../controller/users'),
    User = require('../models/User'),
    router = express.Router({mergeParams: true});

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User),getUsers)
    .post(createUser);


router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
