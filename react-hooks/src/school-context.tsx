import { createContext, useContext, useReducer } from "react";

export type Student = {
  id: string;
  name: string;
};
export type Test = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
};

export type Teacher = {
  id: string;
  name: string;
  students: string[];
};

export type InitialState = {
  teachers: Teacher[];
  students: Student[];
  tests: Test[];
};

export enum SchoolActionKind {
  ADD_TEACHER = "ADD_TEACHER",
  ADD_STUDENT = "ADD_STUDENT",
  ADD_TEST = "ADD_TEST",
  UPDATE_STUDENT = "UPDATE_STUDENT",
  ASSIGN_STUDENT_TO_TEACHER = "ASSIGN_STUDENT_TO_TEACHER",
}

export type SchoolAction =
  | {
      type: SchoolActionKind.ADD_TEACHER;
      payload: Teacher;
    }
  | {
      type: SchoolActionKind.ADD_STUDENT;
      payload: Student;
    }
  | {
      type: SchoolActionKind.ADD_TEST;
      payload: Test;
    }
  | {
      type: SchoolActionKind.UPDATE_STUDENT;
      payload: Student;
    }
  | {
      type: SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER;
      payload: {
        teacherId: string;
        studentId: string;
      };
    };

const SchoolContext = createContext<InitialState | null>(null);
const SchoolDispatchContext =
  createContext<React.Dispatch<SchoolAction> | null>(null);

export function SchoolProvider({ children }: { children?: React.ReactNode }) {
  const [school, dispatch] = useReducer(schoolReducer, initialState);

  return (
    <SchoolContext.Provider value={school}>
      <SchoolDispatchContext.Provider value={dispatch}>
        {children}
      </SchoolDispatchContext.Provider>
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  return useContext(SchoolContext);
}

export function useSchoolDispatch() {
  return useContext(SchoolDispatchContext);
}

export function schoolReducer(
  state: InitialState,
  action: SchoolAction
): InitialState {
  switch (action.type) {
    case SchoolActionKind.ADD_TEACHER:
      return { ...state, teachers: [...state.teachers, action.payload] };
    case SchoolActionKind.ADD_STUDENT:
      return { ...state, students: [...state.students, action.payload] };
    case SchoolActionKind.ADD_TEST:
      return { ...state, tests: [...state.tests, action.payload] };
    case SchoolActionKind.UPDATE_STUDENT:
      const updatedStudents: Student[] = [];
      for (let s of state.students) {
        if (s.id === action.payload.id) {
          updatedStudents.push(action.payload);
        } else {
          updatedStudents.push(s);
        }
      }
      return { ...state, students: updatedStudents };
    case SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER:
      const updatedTeacher: Teacher[] = [];
      for (let t of state.teachers) {
        if (t.id === action.payload.teacherId) {
          updatedTeacher.push({
            ...t,
            students: [...t.students, action.payload.studentId],
          });
        } else {
          updatedTeacher.push(t);
        }
      }
      return { ...state, teachers: updatedTeacher };
    default:
      return state;
  }
}

const initialState: InitialState = {
  teachers: [],
  students: [],
  tests: [],
};
console.log("STATE", initialState);
