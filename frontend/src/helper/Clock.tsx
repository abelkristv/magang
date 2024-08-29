/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerID);
    }, []);

    const clockContainerStyle = css`
        text-align: center;
        padding: 10px;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;

    const timeStyle = css`
        display: flex;
        justify-content: center;
    `;

    const hourStyle = css`
        font-size: 24px;
    `;

    const minuteStyle = css`
        font-size: 24px;
    `;

    const periodStyle = css`
        font-size: 18px;
        margin-top: 5px;
    `;

    let hours = time.toLocaleTimeString([], { hour: '2-digit', hour12: true }).split(':')[0];
    hours = hours[0] + hours[1];
    console.log(hours)
    const minutes = time.toLocaleTimeString([], { minute: '2-digit' });
    const period = time.toLocaleTimeString([], { hour: '2-digit', hour12: true }).split(' ')[1];

    return (
        <div css={clockContainerStyle}>
            <div css={timeStyle}>
                <div css={hourStyle}>{hours}</div>
            </div>
            <div css={timeStyle}>
                <div css={minuteStyle}>{minutes}</div>
            </div>
            <div css={timeStyle}>
                <div css={periodStyle}>{period}</div>
            </div>
        </div>
    );
}

export default Clock;
