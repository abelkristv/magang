import styled from "@emotion/styled";

export const Main = styled.main`
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 40px 43px;
    box-sizing: border-box;
    overflow: hidden;
`;

export const NavSide = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: white;

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
    items-align: center;
    justify-content: center;
    gap: 20px;
    box-shadow: 0px 0px 5px 1px #dbdbdb;
    border-radius: 10px;
    width: 100%;
    min-width: 900px;
    position: relative;
    margin-top: -1rem;

    img {
        width: 160px;
        height: 210px;
        object-fit: cover;
        border-radius: 10px 0px 0px 10px;
    }

    @keyframes pulse {
        0% {
            background-color: #e0e0e0;
        }
        50% {
            background-color: #f0f0f0;
        }
        100% {
            background-color: #e0e0e0;
        }
    }
    
    .loading-placeholder {
        animation: pulse 1.5s infinite ease-in-out;
        border-radius: 5px;
    }

    
`;

export const UserDesc = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    padding: 15px;
    height: 100%;
    justify-content: center;
    items-align: center;
`;

export const InfoContainer = styled.div`
    display: flex;
    align-items: top;
    width: 100%;
    color: black;
    @keyframes pulse {
        0% {
            background-color: #e0e0e0;
        }
        50% {
            background-color: #f0f0f0;
        }
        100% {
            background-color: #e0e0e0;
        }
    }

    .loading-placeholder {
        animation: pulse 1.5s infinite ease-in-out;
        border-radius: 5px;
    }
`;

export const InfoContainer2 = styled.div`
    display: flex;
    width: 100%;
    color: black;
    @keyframes pulse {
        0% {
            background-color: #e0e0e0;
        }
        50% {
            background-color: #f0f0f0;
        }
        100% {
            background-color: #e0e0e0;
        }
    }

    .loading-placeholder {
        animation: pulse 1.5s infinite ease-in-out;
        border-radius: 5px;
    }
`;

export const Information = styled.div`
    margin-top: 15px;
    color: #51587E;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const GreaterInformationContainer = styled.div`
    display: flex;
    font-size: 15px;

    .left-side {
        width: 48%;
    }

    .right-side {
        width: 53%;
        margin-left: -5%;
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
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
    }
`;

export const BottomContentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 50px;

    .left-side {
        width: 63%;
    }

    .right-side {
        width: 37%;
    }
`;

export const Dropdown = styled.div`
    padding: 10px;
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        width: 200px;
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;
`;

export const DropdownFilterOption = styled.option`
    font-size: 15px;
`;

export const DropdownContent = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    // gap: 20px;
    font-size: 18px;
    background-color: #EBEBEB;
    text-align: start;
    position: absolute;
    top: 120%;
    left: -19%;
    width: 300px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 10;
`;

export const Button = styled.button`
    border: none;
    background-color: #49A8FF;
    padding: 10px;
    color: white;
    border-radius: 6px;
    font-weight: 600;
    font-size: 20px;
    margin-top: 40px;

    &:hover {
        cursor: pointer;
        background-color: #309CFF;
    }
`;

export const ReportItem = styled.div`
    border-bottom: 1px solid rgba(0,0,0, 0.3);
    padding: 10px 0 30px 0;
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 5px;
    margin-bottom: 18px;

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
    border: 1.4px solid #49A8FF;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    width: fit-content;
    color: #49A8FF;
    background-color: white;

    &:hover {
        background-color: #ebebeb;
        cursor: pointer;
    }
`;

export const ShowMeetingSchedule = styled.p`
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
`;

export const Placeholder = styled.div`
    border-bottom: 1px solid rgba(0,0,0, 0.3);
    padding: 10px 0 30px 0;
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 5px;
    margin-bottom: 18px;
    background-color: #f0f0f0;
    animation: pulse 1.5s infinite;

    .topSide {
        display: flex;
        justify-content: space-between;
        .topLeftSide, .topRightSide {
            display: flex;
            gap: 20px;
            align-items: center;
        }
    }

    .infoAndDate {
        p {
            width: 50%;
            height: 14px;
            background-color: #ddd;
            border-radius: 4px;
        }
    }

    .report-content {
        width: 100%;
        height: 87px;
        background-color: #ddd;
        border-radius: 5px;
    }

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }
`;
