const Department = require('../models/Department');
const { LEVEL_UNIT_CAPS } = require('../utils/unitCaps');
const sendServerError = require('../utils/sendServerError');

exports.addDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('faculty');
    res.json(departments);
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getDepartmentsByFaculty = async (req, res) => {
  try {
    const departments = await Department.find({ faculty: req.params.facultyId });
    res.json(departments);
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getUnitCaps = (req, res) => {
  res.json(LEVEL_UNIT_CAPS);
};
