/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface AttendanceTableProps {
    sortedAttendanceList: string[];
    handleSort: (field: string) => void;
    getSortArrow: (field: string) => string;
}


const attendanceTableContainerStyle = css`
    max-height: 505px;
    height: 505px;
    overflow-y: auto;
    scrollbar-width: thin;
`;

const attendanceTableStyle = css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 5px;
    border: 2px solid #FFFFFF;
    border-radius: 15px;

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
        background-color: #C2C2C2;
        font-weight: 500;
    }

    thead th:last-of-type {
        border-top-right-radius: 10px;
    }
    
    tbody{
        tr{
            vertical-align: top;
        }
    }

    tbody tr:nth-of-type(odd) {
        background-color: #ffffff;
        &:hover{
            background-color: #E2E2E2;
        }
    }
    
    tbody tr:nth-of-type(even) {
        background-color: #CFCFCF;
        &:hover{
            background-color: #C7C7C7;
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

const AttendanceTable = ({ sortedAttendanceList, handleSort, getSortArrow }: AttendanceTableProps) => {
    return (
        <div css={attendanceTableContainerStyle}>
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
                    {sortedAttendanceList && sortedAttendanceList.length > 0 ? (
                        sortedAttendanceList.map((attendee, index) => (
                            <tr key={index}>
                                <td className="no-column" style={{ borderLeft: "2px solid #C2C2C2", borderBottom: index === sortedAttendanceList.length - 1 ? "2px solid #C2C2C2" : "none", borderTop: "none" }}>{index + 1}</td>
                                <td style={{ borderRight: "2px solid #C2C2C2", borderBottom: index === sortedAttendanceList.length - 1 ? "2px solid #C2C2C2" : "none", borderTop: "none" }}>{attendee}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} style={{ border: "2px solid #C2C2C2", borderTop: "none", textAlign:"center" }}>No attendees found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
