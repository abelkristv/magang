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
    width: 800px;

    input {
        padding: 15px;
        border-radius: 50px 0px 0px 50px;
        border: 1px solid #000000;
        width: 100%;

        &:focus {
            outline: none;
        }
    }
`;

const buttonStyle = css`
    background-color: #000000;
    border: none;
    border-radius: 0px 20px 20px 0px;
    padding: 10px 10px 10px 5px;
    width: 50px;
    // margin-right: 74px;

    &:hover {
        cursor: pointer;
        background-color: #000000;
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
                placeholder="Find Your Student"
                value={searchQuery}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
            />
            <button className="buttonStyle" css={buttonStyle} onClick={onSearch}>
                <Icon icon={"tabler:search"} color="white" fontSize={20} />
            </button>
        </div>
    );
};

export default SearchInput;
