// Maximum units per semester by level. Level 500 only applies to
// 5-year programs (e.g. Engineering) — enforced via Department.durationYears.
const LEVEL_UNIT_CAPS = {
  100: 23,
  200: 22,
  300: 18,
  400: 17, // includes 6-unit project
  500: 18
};

module.exports = { LEVEL_UNIT_CAPS };
