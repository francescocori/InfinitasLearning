import React, { useState } from "react";
import {
  SchoolActionKind,
  useSchool,
  useSchoolDispatch,
} from "./school-context";
import infinitasLogo from "/infinitas-logo.svg";
import "./App.css";

function App() {
  const school = useSchool();
  const schoolDispatch = useSchoolDispatch();

  const [studentEditingId, setUserEditingId] = useState<string | null>(null);
  const [studentEditingId3, setStudentEditingId3] = useState<string | null>(
    null
  );
  const [updatedStudentName, setUpdatedStudentName] = useState<string>("");

  const [teacherEditingId, setTeacherEditingId] = useState<string | null>(null);
  const [newAssignedStudentId, setNewAssignedStudentId] = useState<
    string | null
  >(null);
  const [newAssignedTestId3, setNewAssignedTestId3] = useState<string | null>(
    null
  );
  const [isPassed, setIsPassed] = useState(false);

  // Function to handle switch toggle
  const handleToggle = (
    studentId: string,
    testId: string,
    isPassed: boolean
  ) => {
    schoolDispatch?.({
      type: SchoolActionKind.SCORE_TEST,
      payload: { studentId, testId, isPassed: !isPassed },
    });
  };

  const handleTeacherSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const teacherName = target.teacher.value;
    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_TEACHER,
      payload: { name: teacherName, id, students: [] },
    });

    target.reset();
  };

  const handleStudentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const studentName = target.student.value;

    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_STUDENT,
      payload: { name: studentName, id, assignment: [] },
    });

    target.reset();
  };

  const handleCreateAssignment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const assignmentName = target.assignment.value;
    const assignmentDescription = target.description.value;
    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_ASSIGNMENT,
      payload: { name: assignmentName, description: assignmentDescription, id },
    });
    target.reset();
  };

  const handleUpdateStudent = () => {
    if (studentEditingId) {
      schoolDispatch?.({
        type: SchoolActionKind.UPDATE_STUDENT,
        payload: {
          name: updatedStudentName,
          id: studentEditingId,
          assignment: [],
        },
      });
    }

    setUserEditingId(null);
    setUpdatedStudentName("");
  };

  const handleAssignStudent = () => {
    if (teacherEditingId && newAssignedStudentId) {
      schoolDispatch?.({
        type: SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER,
        payload: {
          teacherId: teacherEditingId,
          studentId: newAssignedStudentId,
        },
      });
    }

    setTeacherEditingId(null);
    setNewAssignedStudentId(null);
  };

  const handleAssignTest = () => {
    if (studentEditingId3 && newAssignedTestId3) {
      schoolDispatch?.({
        type: SchoolActionKind.ASSIGN_TEST_TO_STUDENT,
        payload: {
          studentId: studentEditingId3,
          assignmentId: newAssignedTestId3,
        },
      });
    }
    setStudentEditingId3(null);
    setNewAssignedTestId3(null);
  };

  console.log("state", school);

  return (
    <>
      <div className="App">
        <div>
          <a href="/" target="_blank">
            <img src={infinitasLogo} className="logo" alt="Infinitas logo" />
          </a>
        </div>
        <h1>IL Interview</h1>
        <div className="section">
          <h2>Teacher</h2>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {school?.teachers.map((teacher) => {
                return (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.name}</td>
                    <td>
                      <ul>
                        {teacher.students.map((s) => (
                          <li>
                            {school?.students.map((s1) =>
                              s === s1.id ? s1.name : ""
                            )}
                          </li>
                        ))}
                      </ul>

                      {teacher.id === teacherEditingId ? (
                        <>
                          <select
                            value={newAssignedStudentId || ""}
                            onChange={(e) =>
                              setNewAssignedStudentId(e.target.value)
                            }
                          >
                            <option value={""}></option>
                            {school?.students.map((student) => (
                              <option value={student.id}>{student.name}</option>
                            ))}
                          </select>
                          <button onClick={handleAssignStudent}>Assign</button>
                        </>
                      ) : (
                        <button onClick={() => setTeacherEditingId(teacher.id)}>
                          Assign student
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr></hr>
          <form onSubmit={handleTeacherSubmit}>
            <label htmlFor="teacher">Teacher</label>
            <input type="text" id="teacher" name="teacher" />
            <button type="submit">Add Teacher</button>
          </form>
        </div>
        <div className="section">
          <h2>Students</h2>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Action</th>
                <th>Test</th>
              </tr>
            </thead>
            <tbody>
              {school?.students.map((student) => {
                return (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      {student.id === studentEditingId ? (
                        <>
                          <input
                            type="text"
                            value={updatedStudentName}
                            onChange={(e) =>
                              setUpdatedStudentName(e.target.value)
                            }
                          ></input>
                          <button onClick={handleUpdateStudent}>Done</button>
                        </>
                      ) : (
                        <button onClick={() => setUserEditingId(student.id)}>
                          Update
                        </button>
                      )}
                    </td>
                    <td>
                      <ul>
                        {student.assignment.map((a, i) => (
                          <li key={i} className="flex">
                            <div className="flex">
                              {school?.assignments.map((a1) =>
                                a.testId === a1.id ? (
                                  <div className="flex" key={a1.id}>
                                    {a1.name}
                                    <input
                                      type="checkbox"
                                      id="switch"
                                      checked={a.isPassed}
                                      onChange={() =>
                                        handleToggle(
                                          student.id,
                                          a1.id,
                                          a.isPassed
                                        )
                                      }
                                    />
                                  </div>
                                ) : null
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>

                      {student.id === studentEditingId3 ? (
                        <>
                          <select
                            value={newAssignedTestId3 || ""}
                            onChange={(e) =>
                              setNewAssignedTestId3(e.target.value)
                            }
                          >
                            <option value={""}></option>
                            {school?.assignments.map((assignment) => (
                              <option value={assignment.id} key={assignment.id}>
                                {assignment.name}
                              </option>
                            ))}
                          </select>
                          <button onClick={handleAssignTest}>Assign</button>
                        </>
                      ) : (
                        <button
                          onClick={() => setStudentEditingId3(student.id)}
                        >
                          Assign test
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr></hr>
          <form onSubmit={handleStudentSubmit}>
            <label htmlFor="student">Student</label>
            <input type="text" id="student" name="student" />
            <button type="submit">Add Student</button>
          </form>
          <form onSubmit={handleCreateAssignment}>
            <label htmlFor="assignment">Assignment</label>
            <input type="text" id="assignment" name="assignment" />
            <label htmlFor="description">Description</label>
            <input type="text" id="description" name="description" />
            <button type="submit">Add Assignment</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
