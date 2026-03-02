const CoworkingSpace = require('../models/CoworkingSpace');
const Reservation = require('../models/Reservation');

//@desc     Get all co-working spaces
//@route    GET /api/v1/coworkingspaces
//@access   Public
exports.getCoworkingSpaces = async (req, res, next) => {
  let query;

  // 1. Copy req.query
  const reqQuery = { ...req.query };

  // 2. Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // 3. Create query string & add $ sign for operators
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // 4. Finding resource
  const filter = JSON.parse(queryStr);
  query = CoworkingSpace.find(filter).populate('reservations');

  // 5. Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // 6. Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 7. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await CoworkingSpace.countDocuments(filter);
    query = query.skip(startIndex).limit(limit);

    const coworkingSpaces = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
      success: true,
      count: coworkingSpaces.length,
      pagination,
      data: coworkingSpaces,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//@desc     Get single co-working space
//@route    GET /api/v1/coworkingspaces/:id
//@access   Public
exports.getCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingSpace = await CoworkingSpace.findById(req.params.id);

    if (!coworkingSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working space found with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: coworkingSpace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//@desc     Create new co-working space
//@route    POST /api/v1/coworkingspaces
//@access   Private/Admin
exports.createCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingSpace = await CoworkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coworkingSpace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//@desc     Update co-working space
//@route    PUT /api/v1/coworkingspaces/:id
//@access   Private/Admin
exports.updateCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingSpace = await CoworkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coworkingSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working space found with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: coworkingSpace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//@desc     Delete co-working space
//@route    DELETE /api/v1/coworkingspaces/:id
//@access   Private/Admin
exports.deleteCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingSpace = await CoworkingSpace.findById(req.params.id);

    if (!coworkingSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working space found with the id of ${req.params.id}`,
      });
    }

    // Cascade delete: remove all reservations linked to this co-working space
    await Reservation.deleteMany({ coworkingSpace: req.params.id });

    await coworkingSpace.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
