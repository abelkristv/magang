/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const discussionDetailStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-left: 2px solid #ACACAC;
    padding-left: 20px;
    margin-top: 20px;

    .information {
        display: flex;
        .leftSide {
            display: flex;
            width: 30%;
            align-items: center;
            gap: 20px;
        }
    }
`;

const DiscussionDetails = ({ discussionDetails, formatDate }) => {
    return (
        <div>
            {discussionDetails ? (
                discussionDetails.map((detail, index) => (
                    <div key={index} css={discussionDetailStyle}>
                        <p>{detail.discussionTitle}</p>
                        <div className="information">
                            <div className="leftSide">
                                <Icon icon={"fluent-mdl2:set-action"} />
                                <p>Further Actions</p>
                            </div>
                            <p>{detail.furtherActions}</p>
                        </div>
                        <div className="information">
                            <div className="leftSide">
                                <Icon icon={"material-symbols:avg-time"} />
                                <p>Deadline</p>
                            </div>
                            <p>{formatDate(detail.deadline)}</p>
                        </div>
                        <div className="information">
                            <div className="leftSide">
                                <Icon icon={"material-symbols:avg-time"} />
                                <p>Person Responsible</p>
                            </div>
                            <p>{detail.personResponsible}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading discussion details...</p>
            )}
        </div>
    );
}

export default DiscussionDetails;
