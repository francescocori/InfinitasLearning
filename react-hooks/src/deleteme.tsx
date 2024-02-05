import React from "react";

export const deleteme = () => {
  return (ss
    <div>
      <td>
        <ul>
          {teacher.students.map((s) => (
            <li>
              {school?.students.map((s1) => (s === s1.id ? s1.name : ""))}
            </li>
          ))}
        </ul>
        {teacher.id === teacherEditingId ? (
          <>
            <select
              value={newAssignedStudentId || ""}
              onChange={(e) => setNewAssignedStudentId(e.target.value)}
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
    </div>
  );
};
