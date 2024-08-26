/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface DiscussionResultsTableProps {
    results: string[];
}

const discussionResultsContainerStyle = css`
    max-height: 505px;
    height: 505px;
    overflow-y: auto;
    scrollbar-width: thin;
`;

const discussionResultsTableStyle = css`
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
    }

    thead{
        tr{
            th{
                font-weight: 500;
            }
        }
    }

    th {
        background-color: #f2f2f2;
    }

    thead th:first-of-type {
        border-top-left-radius: 10px;
    }

    thead th {
        background-color: #C2C2C2;
        font-weight: 400;
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

    .result-column {
        width: 95%; 
    }
`;

const DiscussionResultsTable = ({ results }: DiscussionResultsTableProps) => {
    return (
        <div css={discussionResultsContainerStyle}>
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
                                <td className="no-column" style={{ borderLeft: "2px solid #C2C2C2", borderBottom: index === results.length - 1 ? "2px solid #C2C2C2" : "none", borderTop: "none" }}>{index + 1}</td>
                                <td className="result-column" style={{ borderRight: "2px solid #C2C2C2", borderBottom: index === results.length - 1 ? "2px solid #C2C2C2" : "none", borderTop: "none" }}>{result}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DiscussionResultsTable;
