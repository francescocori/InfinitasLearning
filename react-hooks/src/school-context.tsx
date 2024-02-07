import { createContext, useContext, useReducer } from "react";

export type Student = {
  id: string;
  name: string;
  // assignment: string[];
  assignment: StudentTest[];
};
export type StudentTest = {
  testId: string;
  isPassed: boolean;
};
export type Assignment = {
  id: string;
  name: string;
  description: string;
};

export type Teacher = {
  id: string;
  name: string;
  students: string[];
};

export type InitialState = {
  teachers: Teacher[];
  students: Student[];
  assignments: Assignment[];
};

export enum SchoolActionKind {
  ADD_TEACHER = "ADD_TEACHER",
  ADD_STUDENT = "ADD_STUDENT",
  ADD_ASSIGNMENT = "ADD_ASSIGNMENT",
  UPDATE_STUDENT = "UPDATE_STUDENT",
  ASSIGN_STUDENT_TO_TEACHER = "ASSIGN_STUDENT_TO_TEACHER",
  ASSIGN_TEST_TO_STUDENT = "ASSIGN_TEST_TO_STUDENT",
  SCORE_TEST = "SCORE_TEST",
}

export type SchoolAction =
  | {
      type: SchoolActionKind.SCORE_TEST;
      payload: {
        studentId: string;
        testId: string;
        isPassed: boolean;
      };
    }
  | {
      type: SchoolActionKind.ADD_TEACHER;
      payload: Teacher;
    }
  | {
      type: SchoolActionKind.ADD_STUDENT;
      payload: Student;
    }
  | {
      type: SchoolActionKind.ADD_ASSIGNMENT;
      payload: Assignment;
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
    }
  | {
      type: SchoolActionKind.ASSIGN_TEST_TO_STUDENT;
      payload: {
        studentId: string;
        assignmentId: string;
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
    case SchoolActionKind.ADD_ASSIGNMENT:
      return { ...state, assignments: [...state.assignments, action.payload] };
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
    case SchoolActionKind.ASSIGN_TEST_TO_STUDENT:
      const updatedStudent: Student[] = [];
      for (let s of state.students) {
        if (s.id === action.payload.studentId) {
          updatedStudent.push({
            ...s,
            assignment: [
              ...s.assignment,
              { testId: action.payload.assignmentId, isPassed: false },
            ],
          });
        } else {
          updatedStudent.push(s);
        }
      }
      return { ...state, students: updatedStudent };
    case SchoolActionKind.SCORE_TEST:
      const { studentId, testId, isPassed } = action.payload;
      const updatedStudents3 = state.students.map((student) => {
        if (student.id === studentId) {
          const updatedStudentTest = student.assignment.map((assignment) => {
            if (assignment.testId === testId) {
              return { ...assignment, isPassed };
            }
            return assignment;
          });
          return { ...student, assignment: updatedStudentTest };
        }
        return student;
      });
      return { ...state, students: updatedStudents3 };
    default:
      return state;
  }
}

const initialState: InitialState = {
  teachers: [],
  students: [],
  assignments: [],
};
