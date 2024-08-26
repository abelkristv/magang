/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SearchHistoryProps {
    searchHistory: string[];
    isSearchHistoryOpen: boolean;
    handleSearchHistoryClick: (query: string) => void;
}

const searchHistoryStyle = css`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;

    .container {
        &:hover {
            background-color: #EBEBEB;
            cursor: pointer;
        }
    }

    p {
        margin: 0;
        text-align: start;
    }
`;

const SearchHistory = ({ searchHistory, isSearchHistoryOpen, handleSearchHistoryClick }: SearchHistoryProps) => {
    if (!isSearchHistoryOpen || searchHistory.length === 0) return null;

    return (
        <div className="searchHistory" css={searchHistoryStyle}>
            {searchHistory.map((history, index) => (
                <div
                    key={index}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSearchHistoryClick(history);
                    }}
                    className="container"
                    style={{ display: "flex", gap: "5px", alignItems: "center", paddingLeft: "13px", paddingTop: "10px", paddingBottom: "10px" }}
                >
                    <Icon icon={"material-symbols:history"} fontSize={24} color="#ACACAC" />
                    <p style={{ color: "#ACACAC" }}>{history}</p>
                </div>
            ))}
        </div>
    );
};

export default SearchHistory;