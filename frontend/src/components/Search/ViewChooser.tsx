/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ChangeEvent } from "react";

interface ViewChooserProps {
    isGridView: boolean;
    onViewChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const viewChooserStyle = css`
    display: flex;
    gap: 30px;
`;

const checkbox = css`
    display: flex;
    align-items: center;
    font-size: 16px;
    gap: 5px;

    input {
        width: 20px;
        height: 20px;
    }
`;

const ViewChooser = ({ isGridView, onViewChange }: ViewChooserProps) => {
    return (
        <div className="viewChooser" css={viewChooserStyle}>
            <div className="checkbox" css={checkbox}>
                
            </div>
            <div className="checkbox" css={checkbox}>
                
            </div>
        </div>
    );
};

export default ViewChooser;
