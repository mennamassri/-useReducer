import { useState } from 'react';
import { validateStudent } from '../utils/validation';

type Student = {
  id: string;
  name: string;
  age: number;
  isGraduated: boolean;
  coursesList: string[];
  absents: number;
};

const INITIAL_STUDENT: Student = {
  id: '',
  name: '',
  age: 0,
  isGraduated: false,
  coursesList: [],
  absents: 0,
};

export const useStudentForm = (onSubmit: (student: Student) => void) => {
  const [student, setStudent] = useState<Student>(INITIAL_STUDENT);
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const handleChange = (field: keyof Student, value: any) => {
    setStudent({ ...student, [field]: value });
  };

  const handleCoursesChange = (courses: string[]) => {
    setStudent({ ...student, coursesList: courses });
  };

  const handleSubmit = () => {
    const newStudent = { ...student, id: Date.now().toString() };
    const errors = validateStudent(newStudent);

    if (errors.length > 0) {
      setErrorsList(errors);
    } else {
      setErrorsList([]);
      onSubmit(newStudent);
      handleClear();
    }
  };

  const handleClear = () => {
    setStudent(INITIAL_STUDENT);
  };

  return {
    student,
    errorsList,
    handleChange,
    handleCoursesChange,
    handleSubmit,
    handleClear,
  };
};
