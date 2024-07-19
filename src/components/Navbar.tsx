/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helper/AuthProvider';
import dummyPhoto from '../assets/photo.jpg';
import profileIcon from '../assets/icons/profile.png';
import logoutIcon from '../assets/icons/logout.webp';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import User from '../model/User';

function Navbar() {
    const userAuth = useAuth();
    const navigate = useNavigate();
    const [showBox, setShowBox] = useState(false);
    const [userData, setUserData] = useState<User>({} as User);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userAuth?.currentUser?.email) {
                try {
                    const q = query(collection(db, 'user'), where('email', '==', userAuth.currentUser.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const data =  {
                            id : querySnapshot.docs[0].id,
                            name: querySnapshot.docs[0].data().name,
                            email: querySnapshot.docs[0].data().email,
                            image_url: querySnapshot.docs[0].data().image_url,
                            role: querySnapshot.docs[0].data().role,
                            company_name: querySnapshot.docs[0].data().comapany_name
                        } as User;
                        setUserData(data);
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            }
        };
        fetchUserData();
    }, [userAuth?.currentUser?.email]);

    const navbarStyle = css`
        display: flex;
        justify-content: space-between;
        padding-left: 5%;
        padding-right: 5%;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
    `;

    const rightSide = css`
        position: relative;
    `;

    const leftSide = css`
        p {
            font-size: 32px;
        }
    `;

    const profileStyle = css`
        border-radius: 100%;
        object-fit: cover;
        width: 50px;
        height: 50px;
        &:hover {
            cursor: pointer;
        }
    `;

    const boxStyle = css`
        position: absolute;
        border-radius: 20px;
        right: 20px;
        top: 60px;
        width: 200px;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 2;
    `;

    const buttonBoxStyle = css`
    `;

    const boxComponentStyle = css`
        display: flex;
        padding: 10px;
        margin: 10px;
        font-size: 15px;
        background-color: white;
        border-radius: 10px;
        height: 100%;
        border: none;
        &:hover {
            background-color: #e3e3e3;
            cursor: pointer;
        }

        & img {
            width: 30px;
            height: 15px;
        }
    `;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const handleProfileClick = () => {
        setShowBox(!showBox);
    };

    const handleProfile = () => {
        navigate(`/profile/${userData?.id}`);
    };

    const handleStudentList = () => {
        navigate(`/company/studentList/`);
    };

    const handleDocumentation = () => {
        navigate('/activity-documentation')
    }

    console.log("Role : ", userAuth?.currentUser.role)

    return (
        <div css={navbarStyle}>
            <div css={leftSide}>
                <p>Welcome, <b>{userData ? userData.name : userAuth?.currentUser?.email}</b></p>
            </div>
            <div css={rightSide}>
                <img css={profileStyle} src={userData?.image_url} alt="Profile" onClick={handleProfileClick} />
                {showBox && (
                    <div css={boxStyle}>
                        <div css={boxComponentStyle} onClick={handleProfile}>
                            <p css={buttonBoxStyle}>Profile</p>
                        </div>
                        <div css={boxComponentStyle} onClick={handleStudentList}>
                            <p css={buttonBoxStyle}>Student List</p>
                        </div>
                        {
                            userData?.role === "Enrichment" &&
                            <div css={boxComponentStyle} onClick={handleDocumentation}>
                                <p css={buttonBoxStyle}>Documentation</p>
                            </div>
                        }
                        <div css={boxComponentStyle} onClick={handleLogout}>
                            <p css={buttonBoxStyle}>Logout</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
