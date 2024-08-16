import styled from "@emotion/styled";

export const Main = styled.main`
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 40px 43px;
    box-sizing: border-box;
    overflow-y: auto;
`;

export const NavSide = styled.div`
    display: flex;
    justify-content: space-between;

    p {
        text-align: start;
        font-size: 20px;
    }
`;

export const ContentSide = styled.div`
    margin-top: 30px;
`;

export const UserCard = styled.div`
    display: flex;
    gap: 20px;
    box-shadow: 0px 0px 5px 1px #dbdbdb;
    border-radius: 10px;
    width: 100%;
    min-width: 900px;

    img {
        width: 160px;
        height: 210px;
        object-fit: cover;
        border-radius: 10px 0px 0px 10px;
    }
`;

export const UserDesc = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    padding: 20px;
`;

export const InfoContainer = styled.div`
    display: grid;
    grid-template-columns: 0.65fr 1fr;
    width: 100%;
    color: black;
`;

export const Information = styled.div`
    margin-top: 20px;
    color: #51587E;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const GreaterInformationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 17px;

    .left-side {
        width: 50%;
    }

    .right-side {
        width: 46%;
    }
`;

export const Filter = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    p {
        font-size: 15px;
    }

    select {
        padding: 10px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
    }
`;

export const BottomContentContainer = styled.div`
    display: flex;
    margin-top: 15px;
    gap: 50px;

    .left-side {
        width: 60%;
    }

    .right-side {
        width: 40%;
    }
`;

export const Dropdown = styled.div`
    position: relative;
    display: flex;
    background-color: #EBEBEB;
    padding: 10px;
    width: 200px;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
`;

export const DropdownContent = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    gap: 20px;
    font-size: 18px;
    background-color: #EBEBEB;
    text-align: start;
    position: absolute;
    top: 120%;
    left: -49%;
    width: 400px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
`;

export const Button = styled.button`
    border: none;
    background-color: #49A8FF;
    padding: 10px;
    color: white;
    border-radius: 10px;
    font-weight: 600;
    font-size: 20px;
    margin-top: 40px;

    &:hover {
        cursor: pointer;
        background-color: #68b5fc;
    }
`;

export const ReportItem = styled.div`
    border-bottom: 1px solid #ebebeb;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 5px;

    .report-writer {
        font-weight: bold;
    }

    .topSide {
        display: flex;
        justify-content: space-between;
    }

    .topLeftSide {
        display: flex;
        // flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .topRightSide {
        display: flex;
        // flex-direction: column;
        align-items: flex-end;
        gap: 5px;
        justify-content: center;
    }

    .report-hour {
        font-size: 14px;
        color: #888;
    }

    .report-date {
        font-size: 12px;
        color: #888;
    }
`;

export const ButtonWhite = styled.button`
    padding: 6px;
    border: 2px solid #49A8FF;
    border-radius: 5px;
    font-weight: 600;
    margin-top: 10px;
    width: 200px;
    color: #49A8FF;
    background-color: white;

    &:hover {
        background-color: #ebebeb;
        cursor: pointer;
    }
`;

export const ShowMeetingSchedule = styled.p`
    cursor: pointer;
    color: #49A8FF;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;

export const ExpandedCard = styled.div`
    padding: 10px 0px 0px 50px;
    border-radius: 10px;
    margin-top: 0px;

    .meeting-description {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
`;

export const Placeholder = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ebebeb;
    border-radius: 10px;
    background-color: #f9f9f9;
    color: #888;
    font-size: 18px;
`;
