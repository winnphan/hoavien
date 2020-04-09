const Bootcamp = require('../models/Bootcamps');

// @desc        Get all bootcamps
// @route       Get /api/v1/bootcamps
// @access      Public

exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find(req.body);

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (e) {
        res.status(400).json({
           success: false
        });
    }
};

// @desc        Get single bootcamp
// @route       Get /api/v1/bootcamps/:id
// @access      Public

exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({
                success: false
            });
        }
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (e) {
        res.status(400).json({
           success: false
        });
    }
    res
        .status(200)
        .json({success: true, msg: `Show bootcamp ${req.params.id}`});
};

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (e) {
        res.status(400).json({
           success: false
        });
    }
};

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private

exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (e) {
        return res.status(400).json({success: false});
    }
};

// @desc        Delete bootcamp
// @route       Delete /api/v1/bootcamps/:id
// @access      Private

exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (e) {
        return res.status(400).json({success: false});
    }
};
