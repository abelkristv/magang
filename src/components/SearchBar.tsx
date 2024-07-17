/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import PrimaryButton from './elementary/Button';
import arrowLeft from "../assets/icons/arrow-left.png"
import { useNavigate } from 'react-router-dom';

export interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: (query: string) => void;
    isSearching: boolean;
    setIsSearching: (searching: boolean) => void;
}

function SearchBar({ searchQuery, setSearchQuery, onSearch, isSearching, setIsSearching }: SearchBarProps) {
    const searchBarStyle = css`
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        padding-left: 5%;
        padding-right: 5%;
        gap: 40px;
    `;

    const inputStyle = css`
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #ccc;
        font-size: 20px;
    `;

    const handleSearchClick = () => {
        onSearch(searchQuery);
    };

    const buttonStyle = css`
        background-color: #149dff;
        border: none;
        color: "white";
        font-weight: bold;
        font-size: 20px;
        border-radius: 10px;
        // height:
        padding: 10px;
        // width: 100%;
        // height: 100%;
        // box-sizing: border-box;
        &:hover {
            background-color: #36abff;
            cursor: pointer;
        }
    `;

    const navigate = useNavigate()

    return (
        <div css={searchBarStyle}>
            {isSearching && (
                <button css={buttonStyle} onClick={() => setIsSearching(false)}>
                    <img src={arrowLeft} alt="" width={30} height={30} />
                </button>
                
            )}
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                css={inputStyle}
                placeholder="Search by name"
            />
            <PrimaryButton onClick={handleSearchClick} content='Search' height={50} width={200} borderRadius='10px' />
        </div>
    );
}

export default SearchBar;
