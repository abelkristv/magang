/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import User from "../model/User";
import { fetchUser } from "../controllers/UserController";
import { Icon } from "@iconify/react/dist/iconify.js";

const ProfileBox = () => {

    const userAuth = useAuth()
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            
            setUser(user)
            // setStudents(students)
        }
        fetchData()
        // setLoading(false)
    }, []);

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const contentSide = css`
        margin-top: 50px;
    `

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 65%;
        min-width: 900px;

        img {
            width: 220px;
            height: 260px;
            border-radius: 10px 0px 0px 10px;
        }
    `

    const userDescStyle = css`
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: left;
        padding: 20px;
    `

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        // justify-content: space-between;
        width: 100%;
        color: black;
    `

    const informationStyle = css`
        margin-top: 20px;
        color: #51587E;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `

    const buttonSideStyle = css`
        display: flex;
        margin-top: 30px;
        gap: 10px;
        
        button {
            border: 1px solid #DCDCDC;
            padding: 10px;
            background-color: white;
            border-radius: 10px;
            font-size: 17px;
            font-weight: medium;
            cursor: pointer;
            &:hover {
                background-color: #dcdcdc;
            }
        }
    `

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Profile</p>
                <div className="contentSide" css={contentSide}>
                    <div className="userCard" css={userCardStyle}>
                        <img src={user?.image_url} alt="" />
                        <div className="userDesc" css={userDescStyle}>
                            <h1>{user?.name}</h1>
                            <p style={{color: "#51587E"}}>{user?.company_name}</p>
                            <div className="information" css={informationStyle}>
                                <div className="infoContainer" css={infoContainerStyle}>
                                    <div className="container" style={{display: "flex",color: "#51587E", alignItems: "center", gap: "10px"}}>
                                        <Icon icon={"ic:outline-email"} fontSize={20} />
                                        <p>Email address</p>
                                    </div>
                                    
                                    <p>{user?.email}</p>
                                </div>
                                <div className="infoContainer" css={infoContainerStyle}>
                                    <div className="container" style={{display: "flex", color: "#51587E", alignItems: "center", gap: "10px"}}>
                                        <Icon icon={"ic:outline-phone"} fontSize={20}/>
                                        <p>Phone number</p>
                                    </div>
                                    <p>{user?.phone_number}</p>
                                </div>
                                <div className="infoContainer" css={infoContainerStyle}>
                                    <div className="container" style={{display: "flex", color: "#51587E", alignItems: "center", gap: "10px"}}>
                                        <Icon icon={"ph:building-bold"} fontSize={20} />
                                        <p>Organization name</p>
                                    </div>
                                    
                                    <p>{user?.company_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttonSide" css={buttonSideStyle}>
                    <button>Edit Profile</button>
                    <button>Add a student's comment</button>
                </div>
            </div>
        </main>
    );
}

export default ProfileBox;
