/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface SearchHistoryProps {
    searchHistory: string[];
    isSearchHistoryOpen: boolean;
    handleSearchHistoryClick: (query: string) => void;
}

const searchHistoryStyle = css`
    position: absolute;
    top: 100%;
    left: 0;
    width: 51%;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px 8px 8px 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    max-height: 200px;
    overflow-y: auto;

    p {
        padding: 10px;
        margin: 0;
        cursor: pointer;
        text-align: start;

        &:hover {
            background-color: #f2f2f2;
        }
    }
`;

const SearchHistory = ({ searchHistory, isSearchHistoryOpen, handleSearchHistoryClick }: SearchHistoryProps) => {
    if (!isSearchHistoryOpen || searchHistory.length === 0) return null;

    return (
        <div className="searchHistory" css={searchHistoryStyle}>
            {searchHistory.map((history, index) => (
                <p key={index} onClick={() => handleSearchHistoryClick(history)}>{history}</p>
            ))}
        </div>
    );
};

export default SearchHistory;
