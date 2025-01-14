import { useEffect, useReducer, useRef } from "react";
import AddForm from "../components/add-form/add-form.component";
import Student from "../components/student/student.component";
import useLocalStorage from "../hooks/local-storage.hook";

type Student = {
  id: string;
  name: string;
  age: number;
  absents: number;
  isGraduated: boolean;
  coursesList: string[];
};

const initialState = {
  studentsList: [] as Student[],
  totalAbsents: 0,
};


type Action =
  | { type: "INIT_STATE"; payload: { studentsList: Student[]; totalAbsents: number } }
  | { type: "ADD_STUDENT"; payload: Student }
  | { type: "REMOVE_FIRST" }
  | { type: "CHANGE_ABSENT"; payload: { id: string; change: number } };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "INIT_STATE": {
      return {
        ...state,
        studentsList: action.payload.studentsList,
        totalAbsents: action.payload.totalAbsents,
      };
    }
    case "ADD_STUDENT": {
      return {
        ...state,
        studentsList: [action.payload, ...state.studentsList],
      };
    }
    case "REMOVE_FIRST": {
      const updatedList = [...state.studentsList];
      updatedList.shift();
      const updatedTotalAbsents = updatedList.reduce((sum, student) => sum + student.absents, 0);
      return {
        ...state,
        studentsList: updatedList,
        totalAbsents: updatedTotalAbsents,
      };
    }
    case "CHANGE_ABSENT": {
      const updatedStudentsList = state.studentsList.map((student) =>
        student.id === action.payload.id
          ? { ...student, absents: student.absents + action.payload.change }
          : student
      );
      const newTotalAbsents = updatedStudentsList.reduce(
        (sum, student) => sum + student.absents,
        0
      );
      return {
        ...state,
        studentsList: updatedStudentsList,
        totalAbsents: newTotalAbsents,
      };
    }
    default:
      return state;
  }
};

const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastStdRef = useRef<HTMLDivElement>(null);

  const { storedData } = useLocalStorage(state.studentsList, "students-list");

  useEffect(() => {
    if (storedData) {
      const totalAbsents = storedData.reduce((sum, student) => sum + student.absents, 0);
      dispatch({
        type: "INIT_STATE",
        payload: { studentsList: storedData, totalAbsents },
      });
    }
  }, [storedData]);

  const removeFirst = () => {
    dispatch({ type: "REMOVE_FIRST" });
  };

  const handleAbsentChange = (id: string, change: number) => {
    dispatch({ type: "CHANGE_ABSENT", payload: { id, change } });
  };

  const handleAddStudent = (newStudent: Student) => {
    dispatch({ type: "ADD_STUDENT", payload: newStudent });
  };

  const scrollToLast = () => {
    if (lastStdRef.current) {
      lastStdRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <AddForm className="addForm" onSubmit={handleAddStudent} />
      <div className="stats">
        <button onClick={removeFirst}>POP Student</button>
        <button onClick={scrollToLast}>Scroll to Last</button>
        <b style={{ fontSize: "12px", fontWeight: 100, color: "gray" }}>
          Total Absents {state.totalAbsents}
        </b>
      </div>
      {state.studentsList.map((student) => (
        <Student
          key={student.id}
          id={student.id}
          name={student.name}
          age={student.age}
          absents={student.absents}
          isGraduated={student.isGraduated}
          coursesList={student.coursesList}
          onAbsentChange={handleAbsentChange}
        />
      ))}
      <div ref={lastStdRef}></div>
    </>
  );
};

export default Main;
