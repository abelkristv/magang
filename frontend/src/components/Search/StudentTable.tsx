/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import Student from "../../model/Student";

interface StudentTableProps {
  students: Student[];
  totalComments: { [key: string]: number };
  sortField: keyof Student | null;
  sortOrder: "asc" | "desc";
  handleSort: (field: keyof Student) => void;
  onClick?: (studentId: string) => void;
}

const tableStyle = css`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  border: 2px solid #eceaea;
  border-radius: 15px;
  overflow: hidden;

  .no-column {
    width: 7%;
  }

  th,
  td {
    padding: 13px 25px; /* Increase the padding to increase row height */
    border: none;
    text-align: left;
    cursor: pointer;
  }

  th {
    background-color: #f2f2f2;
  }

  thead th:first-of-type {
    border-top-left-radius: 10px;
  }

  thead th {
    background-color: #c2c2c2;
    font-weight: 500;
  }

  thead th:last-of-type {
    border-top-right-radius: 10px;
  }

  tbody tr:nth-of-type(odd) {
    background-color: #ffffff;
    &:hover {
      background-color: #e2e2e2;
    }
  }

  tbody tr:nth-of-type(even) {
    background-color: #cfcfcf;
    &:hover {
      background-color: #c7c7c7;
    }
  }

  tbody tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 10px;
  }

  tbody tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 10px;
  }

  .name-column {
    width: 40%;
  }

  .nim-column {
    width: 10%;
  }
`;

const tableContainerStyle = css`
  max-height: 700px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 2px solid #eceaea;
  border-radius: 15px;
`;

const arrowStyle = css`
  margin-left: 5px; 
`;

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  sortField,
  sortOrder,
  handleSort,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <div css={tableContainerStyle}>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th className="no-column">No.</th>
            <th className="name-column" onClick={() => handleSort("name")}>
              Name
              {sortField === "name" && (
                <span css={arrowStyle}>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="nim-column" onClick={() => handleSort("nim")}>
              NIM
              {sortField === "nim" && (
                <span css={arrowStyle}>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Major</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.iden}
              onClick={() =>
                onClick
                  ? onClick(student.iden)
                  : navigate(`/enrichment-documentation/workspaces/student-detail/${student.iden}`)
              }
            >
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.nim}</td>
              <td>{student.major}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
