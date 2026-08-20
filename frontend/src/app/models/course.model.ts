export interface Faculty {
  _id: string;
  name: string;
}

export interface Department {
  _id: string;
  name: string;
  faculty: string | Faculty;
  durationYears: 4 | 5;
  electiveRules: { min: number; max: number };
}

export interface Course {
  _id?: string;
  courseName: string;
  courseCode: string;
  description?: string;
  department: string | Department;
  level: number;
  type: 'compulsory' | 'elective';
  units: number;
  semester: 'first' | 'second';
}
