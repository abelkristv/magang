/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
    const searchBarStyle = css`
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px;
    `;

    const inputStyle = css`
        width: 80%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    `;

    const buttonStyle = css`
        margin-left: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #007BFF;
        color: white;
        cursor: pointer;
    `;

    return (
        <div css={searchBarStyle}>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                css={inputStyle}
                placeholder="Search by name"
            />
            <button onClick={onSearch} css={buttonStyle}>Search</button>
        </div>
    );
}

export default SearchBar;
