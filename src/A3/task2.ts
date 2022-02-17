// Demonstration use These from fp-ts
import * as These from "fp-ts/These";
import * as Either from 'fp-ts/Either'
interface Student {
    student: string;
    grade?: number;
}
const students: Student[] = [
    {
        student: "Gwion Sutton",
        grade: 99,
    },
    {
        student: "Dafydd Burks",
        grade: 80,
    },
    {
        student: "Carl Braun",
    },
    {
        student: "Rachelle Burrows",
        grade: 100,
    },
    {
        student: "Zakary Colley",
    },
];

// 1. Implementation of These type
/**
 * Calculate students' average grades and also return students who don't have grades
 * @param students 
 */
const calculateAvgGrades = (students: Student[]): These.These<number, Student[]> => {
    let total = 0
    let numberOfStudentsHaveGrades = 0
    const studentsDontHaveGrades: Student[] = []
    for (const student of students) {
        if (student.grade) {
            total += student.grade
        } else {
            studentsDontHaveGrades.push(student)
        }
    }
    if (numberOfStudentsHaveGrades === students.length) {
        return These.left(total / numberOfStudentsHaveGrades)
    } else if (studentsDontHaveGrades.length === students.length) {
        return These.right(studentsDontHaveGrades)
    }
    return These.both(total / numberOfStudentsHaveGrades, studentsDontHaveGrades)
}
const avgGrages = calculateAvgGrades(students)


// 2. Helper methods demonstration
const mapAbsentStudentName = These.map<Student[], string[]>((students) => students.map((student) => student.student))
const avgGragesWithAbsentStudentName = mapAbsentStudentName(avgGrages)

// constain doesn't make much sense here, just for demonstration
const contaions = <L, R>(t: These.These<L, R>, data: Either.Either<L, R>): boolean => These.fold(
    (left1: L) => Either.fold((left2: L) => left1 === left2, () => false)(data),
    (right1) => Either.fold(() => false, (right2: R) => right1 === right2)(data),
    (left1, right1) => Either.fold((left2: L) => left1 === left2, (right2: R) => right1 === right2)(data)
)(t)
// generate a either type
const x = (): Either.Either<number, Student[]> => {
    if (Math.random() > 0.5){
        return Either.left(2)
    }else {
        return Either.right([])
    }
}

// contain works.
contaions(avgGrages, x())


// 3. fold demonstration
console.log(These.fold(
    (avg: number) => `All students attended the exam. Average is: ${avg}.`,
    (students: Student[]) => `${students.length}(all) students didn't attend the exam. No average.`,
    (avg, students) => `${students.length} students didn't attend the exam. Average is: ${avg}.`
)(avgGrages))


