/** @jsxImportSource @emotion/react */
import { useState, FormEvent } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import PrimaryButton from '../components/Elementary/Button';
import { useAuth } from '../helper/AuthProvider';
import User from '../model/User';

import { Icon } from '@iconify/react/dist/iconify.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const authContext = useAuth();

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    const centerCardStyle = css`
        background-color: rgb(255, 255, 255);
        padding: 40px 80px 40px 80px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: start;
        width: 570px;
        height: 494px;
        box-sizing: border-box;
        gap: 20px;
    `;

    const loginHeaderStyle = css`
        font-size: 40px;
        margin: 0px;
        font-weight: 600;
    `;

    const sectionStyle = css`
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5px;
        width: 100%;

        .label {
            font-size: 18px;
        }

        input {
            font-size: 17px;
        }
    `;

    const inputStyle = css`
        width: 100%;
        height: 40px;
        // border-radius: 10px;
        border: none;
        padding: 10px;
        box-sizing: border-box;

        &:focus {
            border: none;
            outline: none;
        } 

        
        // background-color: #f0f0f0;
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 45px;
    `;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (authContext) {
                authContext.setCurrentUser({ email: userCredential.user.email! } as User);
                navigate('/workspaces/dashboard');
            } else {
                setError("Failed to login, unable to set user context");
            }
        } catch (error) {
            setError("Failed to login, make sure you enter the correct email / password");
        }
    };

    const inputContainerStyle = css`
        display: flex;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #ACACAC;
        &:hover {
            border-bottom: 1px solid #26d0ff; 
            svg {
                color: #26d0ff !important;
            }
        }

        gap: 20px;
        
        img {
            width: 20px;
            height: 20px;
        }
    `

    return (
        <main css={mainStyle}>
            <div css={centerCardStyle}>
                <h1 css={loginHeaderStyle}>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div css={sectionStyle}>
                        <label htmlFor="email">Email</label>
                        <div className="inputContainer" css={inputContainerStyle}>
                            <Icon icon={"iconamoon:profile"} fontSize={17} color='#888888'/>
                            <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            css={inputStyle}
                            required
                            />
                        </div>
                        
                    </div>
                    <div css={sectionStyle}>
                        <label htmlFor="password">Password</label>
                        <div className="sectionStyle" css={inputContainerStyle}>
                            <Icon icon={"mdi:password-outline"} fontSize={17} color='#888888' />
                            <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            css={inputStyle}
                            required
                            />
                        </div>
                        
                    </div>
                    <div className="buttonContainer" style={{display: 'flex', justifyContent: "center"}}>
                        <PrimaryButton content={"LOGIN"} height={60} marginTop='30px' borderRadius='41px' bg_color='#000000' bg_color_hover='#262626' width={369} />
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
