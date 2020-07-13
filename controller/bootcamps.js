const path = require('path'),
    ErrorResponse = require('../utils/errorRespone'),
    asyncHandler = require('../middleware/async'),
    geocoder = require('../utils/geocoder'),
    Bootcamp = require('../models/Bootcamps');

// @desc        Get all bootcamps
// @route       Get /api/v1/bootcamps
// @access      Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Get single bootcamp
// @route       Get /api/v1/bootcamps/:id
// @access      Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({success: true, data: bootcamp});
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to req, body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not ad admin, they can only addd one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
            success: true,
            data: bootcamp
        });
});

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({success: true, data: bootcamp});
});

// @desc        Delete bootcamp
// @route       Delete /api/v1/bootcamps/:id
// @access      Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    bootcamp.remove();

    res.status(200).json({success: true, data: bootcamp});
});

// @desc        Get bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode),
        lat = loc[0].latitude,
        lng = loc[0].longitude;

    // Calc radis using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi/ 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
       success: true,
       count: bootcamps.length,
       data: bootcamps
    });
});

// @desc        Delete photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async e => {
        if (e) {
            console.error(e);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
});
