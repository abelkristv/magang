/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface DiscussionResultsTableProps {
    results: string[];
}

const discussionResultsTableStyle = css`
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

    .result-column {
        width: 95%; 
    }
`;

const DiscussionResultsTable = ({ results }: DiscussionResultsTableProps) => {
    return (
        <table css={discussionResultsTableStyle}>
            <thead>
                <tr>
                    <th className="no-column">
                        No.
                    </th>
                    <th>
                        Results
                    </th>
                </tr>
            </thead>
            <tbody>
                {results && results.length > 0 ? (
                    results.map((result, index) => (
                        <tr key={index}>
                            <td className="no-column" style={{ borderLeft: "2px solid #F2F2F2", borderBottom: index === results.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{index + 1}</td>
                            <td className="result-column" style={{ borderRight: "2px solid #F2F2F2", borderBottom: index === results.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{result}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} style={{ textAlign: 'center' }}>No results found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DiscussionResultsTable;
