import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../services/faculty.service';
import { DepartmentService } from '../../services/department.service';
import { CourseService } from '../../services/course.service';
import { RegistrationService } from '../../services/registration.service';
import { AuthService } from '../../services/auth.service';
import { Faculty, Department, Course } from '../../models/course.model';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.css']
})
export class CourseRegistrationComponent implements OnInit {

  faculties: Faculty[] = [];
  departments: Department[] = [];
  compulsoryCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedElectives: string[] = [];

  selectedFacultyId = '';
  selectedDepartmentId = '';
  selectedDepartment: Department | null = null;

  levels = [100, 200, 300, 400];
  level: number | null = null;

  semesters: Array<'first' | 'second'> = ['first', 'second'];
  semester: 'first' | 'second' | null = null;

  session = '';
  unitCaps: Record<number, number> = {};

  // Logged-in student profile — pulled from the API, never localStorage
  currentStudent: any = null;
  loadingStudent = true;
  studentLoadError = '';

  // Submission state
  submitting = false;
  submitError = '';
  submitWarning = '';
  submitSuccess = false;

  constructor(
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private registrationService: RegistrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe(data => this.faculties = data);
    this.departmentService.getUnitCaps().subscribe(caps => this.unitCaps = caps);
    this.session = this.getDefaultSession();

    this.authService.getMe().subscribe({
      next: (student) => {
        this.currentStudent = student;
        this.loadingStudent = false;
      },
      error: () => {
        this.studentLoadError = 'Could not load your profile. Please log in again.';
        this.loadingStudent = false;
      }
    });
  }

  getDefaultSession(): string {
    const now = new Date();
    const year = now.getFullYear();
    const startYear = now.getMonth() >= 8 ? year : year - 1;
    return `${startYear}/${startYear + 1}`;
  }

  selectLevel(lvl: number) {
    this.level = lvl;
    this.resetSubmitState();
    this.tryLoadCourses();
  }

  selectSemester(sem: 'first' | 'second') {
    this.semester = sem;
    this.resetSubmitState();
    this.tryLoadCourses();
  }

  onFacultyChange() {
    this.departments = [];
    this.selectedDepartmentId = '';
    this.resetCourses();
    this.resetSubmitState();
    if (this.selectedFacultyId) {
      this.departmentService.getByFaculty(this.selectedFacultyId).subscribe(data => this.departments = data);
    }
  }

  onDepartmentChange() {
    this.resetCourses();
    this.resetSubmitState();
    this.selectedDepartment = this.departments.find(d => d._id === this.selectedDepartmentId) || null;
    this.tryLoadCourses();
  }

  get availableLevels(): number[] {
    const base = [100, 200, 300, 400];
    if (this.selectedDepartment?.durationYears === 5) base.push(500);
    return base;
  }

  tryLoadCourses() {
    if (!this.selectedDepartmentId || !this.level || !this.semester) return;

    this.courseService.getCoursesByDepartment(this.selectedDepartmentId, this.level, this.semester)
      .subscribe(courses => {
        this.compulsoryCourses = courses.filter(c => c.type === 'compulsory');
        this.electiveCourses = courses.filter(c => c.type === 'elective');
        this.selectedElectives = [];
      });
  }

  resetCourses() {
    this.compulsoryCourses = [];
    this.electiveCourses = [];
    this.selectedElectives = [];
  }

  resetSubmitState() {
    this.submitError = '';
    this.submitWarning = '';
    this.submitSuccess = false;
  }

  get compulsoryUnits(): number {
    return this.compulsoryCourses.reduce((sum, c) => sum + c.units, 0);
  }

  get electiveUnitsSelected(): number {
    return this.electiveCourses
      .filter(c => this.selectedElectives.includes(c._id!))
      .reduce((sum, c) => sum + c.units, 0);
  }

  get totalUnits(): number {
    return this.compulsoryUnits + this.electiveUnitsSelected;
  }

  get maxUnits(): number {
    return this.level ? (this.unitCaps[this.level] ?? 24) : 24;
  }

  get maxElectives(): number {
    return this.selectedDepartment?.electiveRules?.max ?? 3;
  }

  get minElectives(): number {
    return this.selectedDepartment?.electiveRules?.min ?? 2;
  }

  get unitProgressPercent(): number {
    return Math.min(100, Math.round((this.totalUnits / this.maxUnits) * 100));
  }

  isElectiveDisabled(course: Course): boolean {
    const alreadySelected = this.selectedElectives.includes(course._id!);
    if (alreadySelected) return false;
    const wouldBeTotal = this.totalUnits + course.units;
    const wouldExceedMax = this.selectedElectives.length + 1 > this.maxElectives;
    return wouldBeTotal > this.maxUnits || wouldExceedMax;
  }

  toggleElective(courseId: string) {
    if (this.selectedElectives.includes(courseId)) {
      this.selectedElectives = this.selectedElectives.filter(id => id !== courseId);
    } else {
      this.selectedElectives.push(courseId);
    }
    this.resetSubmitState();
  }

  get canSubmit(): boolean {
    return !!this.session &&
           this.selectedElectives.length >= this.minElectives &&
           this.selectedElectives.length <= this.maxElectives &&
           this.totalUnits <= this.maxUnits &&
           !this.submitting;
  }

  get readyForCourses(): boolean {
    return !!(this.selectedDepartmentId && this.level && this.semester);
  }

  onSubmit() {
    if (!this.canSubmit || !this.semester) return;

    this.submitting = true;
    this.resetSubmitState();

    this.registrationService.register({
      session: this.session,
      semester: this.semester,
      electiveCourseIds: this.selectedElectives
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.submitSuccess = true;
        if (res.warning) this.submitWarning = res.warning;
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
