/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import searchIcon from "../assets/icons/search.png"


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
        padding: 10px;
        border: none;
        border-radius: 10px;
        background-color: RGB(162,191,254);
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
            <button onClick={onSearch} css={buttonStyle}><img src={searchIcon}  width={"30px"} height={"30px"} alt="" /></button>
        </div>
    );
}

export default SearchBar;
