/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";

type DiscussionDetail = {
    discussionTitle: string;
    furtherActions: string;
    deadline: { seconds: number; nanoseconds: number };
    personResponsible: string;
};

interface DiscussionDetailsProps {
    discussionDetails: DiscussionDetail[] | null;
    formatDate: (timestamp: { seconds: number; nanoseconds: number }) => string;
}

const discussionDetailDiv = css`
    display: flex;
    flex-direction: column;
    height: 505px;
    max-height: 505px;
    overflow-y: auto;
    scrollbar-width: thin;
`;

const discussionDetailStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-left: 2px solid #ACACAC;
    padding: 10px 0px 10px 15px;
    margin-top: 16px;

    .information {
        display: flex;
        align-items: start;
        .leftSide {
            display: flex;
            width: 22%;
            align-items: center;
            gap: 20px;
        }
    }
`;

const discussionDetailContent = css`
    width: 78%;
`;


const DiscussionDetails: React.FC<DiscussionDetailsProps> = ({ discussionDetails, formatDate }) => {
    return (
        <div css={discussionDetailDiv}>
            {discussionDetails && discussionDetails.length > 0 ? (
                discussionDetails.map((detail, index) => (
                    <div key={index} css={discussionDetailStyle}>
                        <p style={{fontWeight:"500", fontSize:"16px", marginBottom:"5px"}}>{index+1}. {detail.discussionTitle}</p>
                        <div className="information">
                            <div className="leftSide" style={{color:"#51587E", gap:"10px"}}>
                                <Icon icon={"fluent-mdl2:set-action"} fontSize={22} />
                                <p>Further Actions</p>
                            </div>
                            <p css={discussionDetailContent}>{detail.furtherActions}</p>
                        </div>
                        <div className="information">
                            <div className="leftSide" style={{color:"#51587E", gap:"10px"}}>
                                <Icon icon={"material-symbols:avg-time"} fontSize={22} />
                                <p>Deadline</p>
                            </div>
                            <p css={discussionDetailContent}>{formatDate(detail.deadline)}</p>
                        </div>
                        <div className="information">
                            <div className="leftSide" style={{color:"#51587E", gap:"10px"}}>
                                <Icon icon={"flowbite:clipboard-outline"} fontSize={22} />
                                <p>Person Responsible</p>
                            </div>
                            <p css={discussionDetailContent}>{detail.personResponsible}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div css={discussionDetailStyle}>
                    <p style={{fontWeight:"500", fontSize:"16px", marginBottom:"5px"}}>No discussion details found</p>
                </div>
            )}
        </div>
    );
}

export default DiscussionDetails;
