// AddNewDocumentationBox.styles.tsx
import styled from '@emotion/styled';

export const MainStyle = styled.main`
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 40px 43px 40px 43px;
    box-sizing: border-box;
`;

export const NavSide = styled.div`
    p {
        text-align: start;
        font-size: 20px;
    }
`;

export const HeaderP = styled.p`
    background-color: #F5F5F5;
    padding: 10px;
    text-align: center;
    border-radius: 10px 10px 0px 0px;
    font-size: 20px;
`;

export const ContentStyle = styled.div`
    margin-top: 40px;
    border: 1px solid #ebebeb;
    text-align: start;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.25);
`;

export const HeaderGridStyle = styled.div`
    display: flex;
    flex-direction: column;
    text-align: start;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export const ContentSideStyle = styled.div`
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

export const ButtonStyle = styled.button`
    padding: 10px;
    background-color: white;
    color: #49A8FF;
    border: 1px solid #49A8FF;
    border-radius: 5px;
    margin-top: 10px;
    font-size: 15px;

    &:hover {
        background-color: white;
        cursor: pointer;
    }
`;

export const ModalStyle = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

export const ModalContentStyle = styled.div`
    background: white;
    border-radius: 10px;
    width: 557px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 10px;

    .headerp {
        margin: 0px;
        border-radius: 10px 10px 0px 0px;
        background-color: #ebebeb;
        padding: 10px;
        font-size: 19px;
        font-weight: medium;
    }
`;

export const InputStyle = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const ModalFormStyle = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    box-sizing: border-box;

    p {
        text-align: start;
    }

    hr {
        width: 100%;
        background-color: #ACACAC;
        color: #ACACAC;
    }
`;

export const ModalHeaderStyle = styled.div`
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
    align-items: center;
    background-color: #F0ECEC;
`;

export const ModalBoxStyle = styled.div`
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ACACAC;
    display: flex;
    flex-direction: column;

    .attendeeInputContainer {
        display: flex;
        align-items: center;
        input {
            flex-grow: 1;
        }
        .removeIcon {
            margin-right: 10px;
            cursor: pointer;
            visibility: hidden;
        }
        &:hover .removeIcon {
            visibility: visible;
        }
    }

    .attendeeInputContainer:nth-of-type(odd) {
        background-color: #F5F5F5;
        input {
            flex-grow: 1;
            background-color: #F5F5F5;
        }
    }
    .attendeeInputContainer:nth-of-type(even) {
        background-color: white;
        input {
            flex-grow: 1;
            background-color: white;
        }
    }
`;

export const InputAndButtonContainerStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: start;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;

    input {
        flex-grow: 1;
        height: 35px;
        border-radius: 5px;
        border: 1px solid gray;
        padding: 10px;
    }

    button {
        padding: 10px 20px;
        background-color: #49A8FF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 15px;

        &:hover {
            background-color: #62b3fc;
        }
    }
`;

export const AddButtonStyle = styled.button`
    background-color: #49A8FF;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 15px;

    &:hover {
        background-color: #62b3fc;
    }
`;

export const AddButtonContainerStyle = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;

    button {
        width: 400px;
        padding: 10px;
        font-size: 20px;
        border-radius: 10px;
        border: none;
        margin-bottom: 20px;

        background-color: #49A8FF;
        color: white;

        &:hover {
            background-color: #62b3fc;
            cursor: pointer;
        }
    }
`;

export const InputGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;

    input {
        margin: 0px;
        height: 30px;
        border-radius: 5px;
        border: 1px solid #ACACAC;
    }

    .input {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;

export const DiscussionCardStyle = styled.div`
    border: 1px solid #ebebeb;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    background-color: white;

    .itemAction {
        display: grid;
        grid-template-columns: 1fr 1fr;
        .leftSide {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .rightSide {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: flex-end;
        }
    }
`;

export const IconStyle = styled.div`
    &:hover {
        cursor: pointer;
    }
`;

export const CloseButtonStyle = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    color: #888;
`;

export const DocumentationMeetingStyle = styled.div`
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

export const TitleContainerStyle = styled.div`
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

export const ScheduleTopSideStyle = styled.div`
    display: flex;
    gap: 30px;
    margin-top: 20px;
`;

export const TimeContainerStyle = styled.div`
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

export const LocationContainerStyle = styled.div`
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
