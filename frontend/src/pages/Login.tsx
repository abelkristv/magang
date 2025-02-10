/** @jsxImportSource @emotion/react */
import { useState, FormEvent } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/Elementary/Button';
import { useAuth } from '../helper/AuthProvider';
import User from '../model/User';
import binusLogo from "../assets/Logo-SoCS-Black-Blue.png";

import { Icon } from '@iconify/react/dist/iconify.js';
import { AddButton } from '../components/Documentation/Add New Documentation/AddNewDocumentationBox.styles';

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
    `;

    const centerCardStyle = css`
        background-color: rgb(255, 255, 255);
        padding: 40px 50px 40px 50px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 520px;
        box-sizing: border-box;
        gap: 30px;
    `;

    const binusLogoStyle = css`
        width: 60%;
        object-fit: contain;
        border-radius: 6px;
        margin-bottom: 15px;
    `;

    const sectionStyle = css`
        display: flex;
        flex-direction: column;
        align-items: start;
        width: 100%;
        gap: 10px;

        .label {
            font-size: 18px;
        }

        input {
            font-size: 17px;
            box-sizing: border-box;
            width: 100%;
            height: 46px;
            border-radius: 5px;
            border: 1px solid #ACACAC;
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
        width: 100%;
        gap: 20px;
    `;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (authContext) {
                    authContext.setCurrentUser({ email } as User); 
                    localStorage.setItem('token', data.token);
                    navigate('/enrichment-documentation/workspaces/home');
                } else {
                    setError('Failed to login, unable to set user context');
                }
            } else {
                setError(data.error || 'Failed to login, check your email and password');
            }
        } catch (error) {
            setError('Failed to login, please try again later');
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

    const addDocInputText = css`
        padding: 0px 10px;
        font-size: 15px;
    `;

    return (
        <main css={mainStyle}>
            <div css={centerCardStyle}>
                <img src={binusLogo} css={binusLogoStyle} />
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div css={sectionStyle}>
                        <label htmlFor="email">Email</label>
                        <input
                            css={addDocInputText}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div css={sectionStyle}>
                        <label htmlFor="password">Password</label>
                        <input
                            css={addDocInputText}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="buttonContainer">
                        <AddButton style={{width: "235px", fontSize:"17px", fontWeight:"500", marginTop:'35px'}}>Login</AddButton>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
