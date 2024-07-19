/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Student from '../../model/Student';

export interface CustomSelectProps {
    options: Student[];
    value: Student | null;
    onChange: (option: Student) => void;
    filterByCompanyName?: string; // Add the filterByCompanyName prop
    role?: string;
}

function CustomSelect({ options, value, onChange, filterByCompanyName, role }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<Student[]>(options);

    console.log(filterByCompanyName)

    useEffect(() => {
        if (role == "Company") {
            setFilteredOptions(
                options.filter(option =>
                    option.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!filterByCompanyName || option.tempat_magang === filterByCompanyName)
                )
            );
        }     
        else {
            setFilteredOptions(options)
        } 
    }, [searchTerm, options, filterByCompanyName]);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option: Student) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm(''); // Reset search term when an option is selected
    };

    const dropdownStyle = css`
        position: relative;
        width: 100%;
        box-sizing: border-box;
    `;

    const selectedStyle = css`
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        border: 1px solid #ccc;
        border-radius: 10px;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

    const optionsStyle = css`
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 10px;
        background: white;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;

    const optionStyle = css`
        padding: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            background: #f0f0f0;
        }

        img {
            width: 30px;
            height: 30px;
            border-radius: 5px;
            margin-right: 10px;
        }
    `;

    const searchInputStyle = css`
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: none;
        border-bottom: 1px solid #ccc;
        outline: none;
    `;

    return (
        <div css={dropdownStyle}>
            <div css={selectedStyle} onClick={toggleDropdown}>
                <span>{value ? value.name : "Select a student"}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div css={optionsStyle}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        css={searchInputStyle}
                        placeholder="Search students..."
                    />
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            css={optionStyle}
                            onClick={() => handleOptionClick(option)}
                        >
                            <img src={option.image_url} alt={option.name} />
                            <div css={{display: 'flex', flexDirection: "column", alignItems: 'start'}}>
                                <p>{option.name}</p>
                                <p>{option.nim}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;
