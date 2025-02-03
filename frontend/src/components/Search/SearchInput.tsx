/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Icon } from "@iconify/react";
import { ChangeEvent, KeyboardEvent } from "react";

interface SearchInputProps {
    searchQuery: string;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
}

const searchRow = css`
    display: flex;
    position: relative;
    justify-items: center;
    items-align: center;
    width: 808px;
    height: 47px;
    border-radius: 50px 50px 50px 50px;
    box-shadow: 1px 0px 8px rgba(0, 0, 0, 0.3);

    input {
        padding: 15px;
        width: 100%;
        font-size: 18px;
        border: none;
        border-radius: 50px 0px 0px 50px;

        &:focus {
            outline: none;
            border-color: #007bff;
        }
        
        &::placeholder {
            color: #ACACAC;
            font-weight: 400;
        }

        
    }
`;

const buttonStyle = css`
    padding: 10px;
    border: none;
    border-radius: 50px 50px 50px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 100%;
    cursor: pointer;
    background-color: white;

    &:focus {
        outline: none; /* Remove focus outline for button */
    }
`;

const SearchInput = ({
    searchQuery,
    onSearchChange,
    onSearch,
    onKeyDown,
    onSearchFocus,
    onSearchBlur,
}: SearchInputProps) => {
    return (
        <div className="searchRow" css={searchRow}>
            <input
                type="text"
                placeholder="Enter name or NIM"
                value={searchQuery}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
            />
            <button className="buttonStyle" css={buttonStyle} onClick={onSearch}>
                <Icon icon={"tabler:search"} color="#49A8FF" fontSize={27} />
            </button>
        </div>
    );
};

export default SearchInput;
