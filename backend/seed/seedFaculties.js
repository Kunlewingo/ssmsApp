// One-time seed script for Faculties + Departments, matching the list that
// was previously hardcoded in the old add-student.component.ts.
// Run with: node seed/seedFaculties.js
require('dotenv').config();
const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const DATA = {
  Engineering: {
    durationYears: 5,
    departments: ['Computer Engineering', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering']
  },
  Science: {
    durationYears: 4,
    departments: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biochemistry', 'Microbiology']
  },
  'Management Sciences': {
    durationYears: 4,
    departments: ['Accounting', 'Business Administration', 'Marketing', 'Banking and Finance', 'Insurance']
  },
  'Social Sciences': {
    durationYears: 4,
    departments: ['Economics', 'Political Science', 'Psychology', 'Sociology', 'Mass Communication']
  },
  Arts: {
    durationYears: 4,
    departments: ['English', 'History', 'Linguistics', 'Theatre Arts']
  },
  Education: {
    durationYears: 4,
    departments: ['Education Biology', 'Education Chemistry', 'Education Mathematics', 'Guidance and Counselling']
  },
  Law: {
    durationYears: 5,
    departments: ['Law']
  },
  Medicine: {
    durationYears: 6, // NOTE: Medicine is often 6 years in Nigeria — LEVEL_UNIT_CAPS only covers up to 500,
                       // extend utils/unitCaps.js if you need level 600 support.
    departments: ['Medicine and Surgery', 'Nursing', 'Pharmacy', 'Medical Laboratory Science']
  }
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  for (const [facultyName, info] of Object.entries(DATA)) {
    const faculty = await Faculty.findOneAndUpdate(
      { name: facultyName },
      { name: facultyName },
      { upsert: true, new: true }
    );

    for (const deptName of info.departments) {
      await Department.findOneAndUpdate(
        { name: deptName, faculty: faculty._id },
        {
          name: deptName,
          faculty: faculty._id,
          durationYears: info.durationYears > 5 ? 5 : info.durationYears, // cap at 5 to match current unitCaps table
          electiveRules: { min: 2, max: 3 }
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${facultyName} (${info.departments.length} departments)`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
