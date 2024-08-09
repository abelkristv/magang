/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface AttendanceTableProps {
    sortedAttendanceList: string[];
    handleSort: (field: string) => void;
    getSortArrow: (field: string) => string;
}

const attendanceTableStyle = css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 20px;
    border: 2px solid #FFFFFF;
    border-radius: 15px;
    overflow: hidden;

    .no-column {
        width: 5%;
    }

    th,
    td {
        padding: 13px 25px;
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
        background-color: #ECECEC;
        font-weight: 400;
    }

    thead th:last-of-type {
        border-top-right-radius: 10px;
    }

    tbody tr:nth-of-type(odd) {
        background-color: #ffffff;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f5f5f5;
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

const AttendanceTable = ({ sortedAttendanceList, handleSort, getSortArrow }: AttendanceTableProps) => {
    return (
        <table css={attendanceTableStyle}>
            <thead>
                <tr>
                    <th className="no-column" onClick={() => handleSort('no')}>
                        No. <span>{getSortArrow('no')}</span>
                    </th>
                    <th onClick={() => handleSort('name')}>
                        Name <span>{getSortArrow('name')}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedAttendanceList.map((attendee, index) => (
                    <tr key={index}>
                        <td className="no-column" style={{ borderLeft: "2px solid #F2F2F2", borderBottom: index === sortedAttendanceList.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{index + 1}</td>
                        <td style={{ borderRight: "2px solid #F2F2F2", borderBottom: index === sortedAttendanceList.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{attendee}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AttendanceTable;
