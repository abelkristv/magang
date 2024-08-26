// AddNewDocumentationBox.styles.tsx
import styled from '@emotion/styled';


export const MainContainer = styled.div`
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 40px 43px;
    box-sizing: border-box;
`;

export const NavSide = styled.div`
    p {
        text-align: start;
        font-size: 20px;
    }
`;

export const Header = styled.div`
    background-color: #F5F5F5;
    padding: 10px;
    text-align: center;
    border-radius: 10px 10px 0px 0px;
    font-size: 20px;
`;

export const ContentContainer = styled.div`
    margin-top: 40px;
    border: 1px solid #ebebeb;
    text-align: start;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.25);
`;

export const HeaderGrid = styled.div`
    display: flex;
    flex-direction: column;
    text-align: start;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export const ContentSide = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 80px 100px 100px 100px;

    .leftSide {
        width: 50%;
        padding-right: 50px;
        border-right: 1px solid black;
    }
    .rightSide {
        width: 50%;
        padding-left: 50px;
    }

    .input {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 95%;

        input {
            height: 35px;
            border-radius: 5px;
            border: 1px solid gray;
        }
    }
`;

export const Button = styled.button`
    padding: 10px;
    background-color: #49A8FF;
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    font-size: 15px;
    cursor: pointer;

    &:hover {
        background-color: #62b3fc;
    }
`;

export const DocumentationMeeting = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    
    .inputDoc {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        input {
            width: 100%;
            box-sizing: border-box;
            height: 46px;
            border-radius: 5px;
            border: 1px solid #ACACAC;
        }
    }
`;

export const TitleContainer = styled.div`
    width: 100%;
    margin-bottom: 10px;

    .inputTitle {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        input {
            box-sizing: border-box;
            width: 100%;
            height: 46px;
            border-radius: 5px;
            border: 1px solid #ACACAC;
        }
    }
`;

export const ScheduleTopSide = styled.div`
    display: flex;
    gap: 30px;
    margin-top: 20px;
`;

export const TimeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    input {
        height: 47px;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid #ACACAC;
        padding: 10px;
    }
`;

export const LocationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;

    input {
        height: 47px;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid #ACACAC;
        padding: 10px;
    }
`;

export const RequiredLabel = styled.label`
    color: #333;
    font-weight: bold;

    span {
        color: red;
        margin-left: 4px;
    }
`;

export const ErrorText = styled.p`
    color: red;
    font-size: 14px;
`;