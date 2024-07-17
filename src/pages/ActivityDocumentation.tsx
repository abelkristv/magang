/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Ensure this line is uncommented to apply default styles

const ActivityDocumentation = () => {
    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #F5F5F5;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
    `;

    const topSideStyle = css`
        background-color: white;
        border: 1px solid #dbdbdb;
        padding: 20px;
        box-sizing: border-box;
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        width: 100%;
        display: flex;
        height: 45%;
        justify-content: center;
    `;

    const calendarStyle = css`
        width: 100%;
        height: 100%;
        .react-calendar {
            width: 100%;
            height: 100%;
            border: none;
        }
            
        .react-calendar__viewContainer button {
            height: 50px;
            width: 50px;
            &:hover {
                font-weight: bold;
                background: none;
                color: black;
            }

            &:active {
                background-color: #149dff;
                color: white;
                border-radius: 100%;
            }
        }

        .react-calendar__tile--active {
            background-color: #149dff;
            color: white;
            border-radius: 100%;

            &:hover {
                background-color: #149dff !important;
                color: white !important;
                border-radius: 100% !important;
            }
        }
    `;
    
    const mainCardStyle = css`
        background-color: white;
        border: 1px solid #dbdbdb;
        padding: 20px;
        box-sizing: border-box;
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: center;
    `;

    const cardLeftSideStyle = css`
        width: 20%;
        border-right: 1px solid #dbdbdb;
        height: 100%;
    `;

    const cardRightSideStyle = css`
        width: 80%;
        height: 100%;
    `;

    const bottomSideStyle = css``;

    return (
        <>
            <main css={mainStyle}>
                <div className="main-card" css={mainCardStyle}>
                    <div className="left-side" css={cardLeftSideStyle}>
                        <div className="calendar-style" css={calendarStyle}>
                            <Calendar />
                        </div>
                    </div>
                    <div className="right-side" css={cardRightSideStyle}>
                        
                    </div>
                </div>
            </main>
        </>
    );
};

export default ActivityDocumentation;
