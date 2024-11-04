class User {
    constructor({ name, surname, email, role }) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.courses = [];
    }

    addCourse(course, level) {
        this.courses.push({ course, level });
    }

    editCourse(course, level) {
        const courseIndex = this.courses.findIndex(c => c.course === course);
        if (courseIndex !== -1) {
            this.courses[courseIndex].level = level;
        } else {
            this.courses.push({ course, level });
        }
    }
}

class ExtendedUser extends User {
    static match(teacher, student, courseName = null) {
        if (courseName) {
            const studentCourse = student.courses.find(c => c.course === courseName);
            const teacherCourse = teacher.courses.find(c => c.course === courseName);
            if (studentCourse && teacherCourse && teacherCourse.level >= studentCourse.level) {
                return { course: courseName, level: studentCourse.level };
            }
            return undefined;
        } else {
            const matches = student.courses
                .filter(studentCourse => {
                    const teacherCourse = teacher.courses.find(c => c.course === studentCourse.course);
                    return teacherCourse && teacherCourse.level >= studentCourse.level;
                })
                .map(match => ({ course: match.course, level: match.level }));
            return matches;
        }
    }
}

class Teacher extends ExtendedUser {
    constructor({ name, surname, email }) {
        super({ name, surname, email, role: 'teacher' });
    }
}

class Student extends ExtendedUser {
    constructor({ name, surname, email }) {
        super({ name, surname, email, role: 'student' });
    }
}

class Tutoring {
    constructor() {
        this.students = [];
        this.teachers = [];
    }

    getStudentByName(name, surname) {
        return this.students.find(student => student.name === name && student.surname === surname);
    }

    getTeacherByName(name, surname) {
        return this.teachers.find(teacher => teacher.name === name && teacher.surname === surname);
    }

    getStudentsForTeacher(teacher) {
        return this.students.filter(student => ExtendedUser.match(teacher, student).length > 0);
    }

    getTeacherForStudent(student) {
        return this.teachers.filter(teacher => ExtendedUser.match(teacher, student).length > 0);
    }

    addStudent(name, surname, email) {
        const student = new Student({ name, surname, email });
        this.students.push(student);
    }

    addTeacher(name, surname, email) {
        const teacher = new Teacher({ name, surname, email });
        this.teachers.push(teacher);
    }
}

// Pruebas
let tutoring = new Tutoring();
tutoring.addStudent('Rafael', 'Fife', 'rfife@rhyta.com');
tutoring.addStudent('Kelly', 'Estes', 'k_estes@dayrep.com');
tutoring.addTeacher('Paula', 'Thompkins', 'PaulaThompkins@jourrapide.com');

let student = tutoring.getStudentByName('Rafael', 'Fife');
student.addCourse('maths', 2);
student.addCourse('physics', 4);

let teacher = tutoring.getTeacherByName('Paula', 'Thompkins');
teacher.addCourse('maths', 4);

let students = tutoring.getTeacherForStudent(student);
let teachers = tutoring.getStudentsForTeacher(teacher);

console.log(students[0]); // -> Teacher {name: 'Paula', surname: 'Thompkins', ...}
console.log(teachers[0]); // -> Student {name: 'Rafael', surname: 'Fife', ...}

student = tutoring.getStudentByName('Kelly', 'Estes');
students = tutoring.getTeacherForStudent(student);
teachers = tutoring.getStudentsForTeacher(teacher);

console.log(students[0]); // -> undefined
console.log(teachers[0]); // -> Student {name: 'Rafael', surname: 'Fife', ...}
