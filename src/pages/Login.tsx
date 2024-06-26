/** @jsxImportSource @emotion/react */
import { useState, FormEvent } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import PrimaryButton from '../components/Button';
import { useAuth } from '../helper/AuthProvider';
import User from '../model/User';

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
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: start;
        width: 20%;
        gap: 20px;
    `;

    const loginHeaderStyle = css`
        font-size: 40px;
        margin: 0px;
    `;

    const sectionStyle = css`
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5px;
        width: 100%;
    `;

    const inputStyle = css`
        width: 100%;
        height: 40px;
        border-radius: 10px;
        border: none;
        background-color: #f0f0f0;
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 50px;
    `;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (authContext) {
                authContext.setCurrentUser({ email: userCredential.user.email! } as User);
                navigate('/dashboard');
            } else {
                setError("Failed to login, unable to set user context");
            }
        } catch (error) {
            setError("Failed to login, make sure you enter the correct email / password");
        }
    };

    return (
        <main css={mainStyle}>
            <div css={centerCardStyle}>
                <h1 css={loginHeaderStyle}>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div css={sectionStyle}>
                        <label htmlFor="email">Email</label>
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
                    <div css={sectionStyle}>
                        <label htmlFor="password">Password</label>
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
                    <PrimaryButton content={"SUBMIT"} />
                </form>
            </div>
        </main>
    );
};

export default Login;
