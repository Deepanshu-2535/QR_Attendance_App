export const RESOURCE_DEFINITIONS = {
  students: {
    key: 'students',
    label: 'Students',
    singularLabel: 'Student',
    idKey: 'rollNo',
    description: 'Manage student accounts, academic metadata, and roster updates from one place.',
    bulkModes: ['create', 'update'],
    columns: [
      { key: 'rollNo', label: 'Roll No', aliases: ['rollno', 'roll_no'] },
      { key: 'firstName', label: 'First Name', aliases: ['firstname', 'first_name'] },
      { key: 'lastName', label: 'Last Name', aliases: ['lastname', 'last_name'] },
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'semester', label: 'Semester' }
    ],
    fields: [
      { name: 'rollNo', label: 'Roll No', required: true, placeholder: '2024001', aliases: ['roll_no', 'roll number', 'roll', 'rollno'] },
      { name: 'firstName', label: 'First Name', required: true, placeholder: 'Aarav', aliases: ['first_name', 'firstname', 'fname'] },
      { name: 'lastName', label: 'Last Name', placeholder: 'Sharma', aliases: ['last_name', 'lastname', 'lname'] },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'student@college.edu', aliases: ['mail', 'emailaddress', 'email_address'] },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Initial password', aliases: ['defaultpassword', 'default_password'] },
      { name: 'department', label: 'Department', placeholder: 'Computer Science', aliases: ['dept'] },
      { name: 'semester', label: 'Semester', type: 'number', placeholder: '6', aliases: ['sem'] }
    ]
  },
  teachers: {
    key: 'teachers',
    label: 'Teachers',
    singularLabel: 'Teacher',
    idKey: 'teacherId',
    description: 'Create faculty access, keep departments aligned, and maintain teaching profiles.',
    bulkModes: ['create', 'update'],
    columns: [
      { key: 'teacherId', label: 'Teacher ID', aliases: ['teacherid', 'teacher_id'] },
      { key: 'title', label: 'Title' },
      { key: 'firstName', label: 'First Name', aliases: ['firstname', 'first_name'] },
      { key: 'lastName', label: 'Last Name', aliases: ['lastname', 'last_name'] },
      { key: 'email', label: 'Email' },
      { key: 'designation', label: 'Designation' },
      { key: 'department', label: 'Department' }
    ],
    fields: [
      { name: 'teacherId', label: 'Teacher ID', required: true, placeholder: 'T-104', aliases: ['teacher_id', 'facultyid', 'faculty_id'] },
      { name: 'title', label: 'Title', placeholder: 'Dr.', aliases: ['salutation'] },
      { name: 'firstName', label: 'First Name', required: true, placeholder: 'Neha', aliases: ['first_name', 'firstname', 'fname'] },
      { name: 'lastName', label: 'Last Name', placeholder: 'Verma', aliases: ['last_name', 'lastname', 'lname'] },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'teacher@college.edu', aliases: ['mail', 'emailaddress', 'email_address'] },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Initial password', aliases: ['defaultpassword', 'default_password'] },
      { name: 'designation', label: 'Designation', placeholder: 'Assistant Professor', aliases: ['role', 'jobtitle', 'job_title'] },
      { name: 'department', label: 'Department', placeholder: 'Information Technology', aliases: ['dept'] }
    ]
  },
  subjects: {
    key: 'subjects',
    label: 'Subjects',
    singularLabel: 'Subject',
    idKey: 'subjectCode',
    description: 'Configure subject catalog entries and keep faculty mappings consistent across the system.',
    bulkModes: ['create', 'update'],
    columns: [
      { key: 'subjectCode', label: 'Subject Code', aliases: ['subjectcode', 'subject_code'] },
      { key: 'subjectName', label: 'Subject Name', aliases: ['subjectname', 'subject_name'] },
      { key: 'teacherId', label: 'Teacher ID', aliases: ['teacherid', 'teacher_id'] },
      { key: 'department', label: 'Department' },
      { key: 'semester', label: 'Semester' }
    ],
    fields: [
      { name: 'subjectCode', label: 'Subject Code', required: true, placeholder: 'CS301', aliases: ['subject_code', 'code'] },
      { name: 'subjectName', label: 'Subject Name', required: true, placeholder: 'Database Systems', aliases: ['subject_name', 'name'] },
      { name: 'teacherId', label: 'Teacher ID', placeholder: 'T-104', aliases: ['teacher_id', 'facultyid', 'faculty_id'] },
      { name: 'department', label: 'Department', placeholder: 'Computer Science', aliases: ['dept'] },
      { name: 'semester', label: 'Semester', type: 'number', placeholder: '5', aliases: ['sem'] }
    ]
  },
  enrollments: {
    key: 'enrollments',
    label: 'Enrollments',
    singularLabel: 'Enrollment',
    idKey: 'id',
    description: 'Assign students to subjects one-by-one or in bulk using spreadsheet-ready uploads.',
    bulkModes: ['create'],
    columns: [
      { key: 'id', label: 'Enrollment ID' },
      { key: 'rollNo', label: 'Roll No', aliases: ['rollno', 'roll_no'] },
      { key: 'studentName', label: 'Student Name', aliases: ['student', 'name'] },
      { key: 'subjectCode', label: 'Subject Code', aliases: ['subjectcode', 'subject_code'] },
      { key: 'subjectName', label: 'Subject Name', aliases: ['subject'] }
    ],
    fields: [
      { name: 'rollNo', label: 'Roll No', required: true, placeholder: '2024001', aliases: ['roll_no', 'roll number', 'roll'] },
      { name: 'subjectCode', label: 'Subject Code', required: true, placeholder: 'CS301', aliases: ['subject_code', 'code'] }
    ]
  }
}

export const MANAGEABLE_RESOURCES = ['students', 'teachers', 'subjects']
export const BULK_UPLOAD_RESOURCES = ['students', 'teachers', 'subjects', 'enrollments']
