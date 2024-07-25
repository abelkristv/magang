/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import dashboardDocum from "../assets/dashboard_docum.png"
import { useState } from "react";
import Student from "../model/Student";
import { useAuth } from "../helper/AuthProvider";
import User from "../model/User";

interface DashboardBoxProps {
    setActiveTab: (str: string) => void;
}

const DashboardBox = ({setActiveTab}: DashboardBoxProps) => {

    const mainDashboardStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
        overflow: scroll;
    `

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `
    

    const documentationBoxStyle = css`
        display: flex;
        margin-top: 100px;
        justify-content: space-around;
    `

    const documentationContentStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: start;useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            const students = await fetchAllStudents()
            
            setUser(user)
            setStudents(students)
        }
        fetchData()
        setLoading(false)
    }, []);
        width: 50%;
        h2 {
            font-size: 50px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        p {
            font-size: 20px;
        }
    `

    const bottomBoxStyle = css`useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            const students = await fetchAllStudents()
            
            setUser(user)
            setStudents(students)
        }
        fetchData()
        setLoading(false)
    }, []);
        display: flex;
        gap: 100px;
        padding: 100px;
        box-sizing: border-box;
    `

    const companyBox = css`
        // border: 1px solid rgba(200, 200, 200, 1);
        box-shadow: 0px 0px 10px 1px rgb(150, 150, 150);
        padding: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            const students = await fetchAllStudents()
            
            setUser(user)
            setStudents(students)
        }
        fetchData()
        setLoading(false)
    }, []);
        flex-direction: column;
        gap: 30px;
        align-items: center;

        button {
            width: 250px;
        }

        h1 {
            font-size: 50px;useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            const students = await fetchAllStudents()
            
            setUser(user)
            setStudents(students)
        }
        fetchData()
        setLoading(false)
    }, []);
            font-weight: 600;
        }

        p {
            font-size: 20px;
        }
    `

    const buttonStyle = css`
        padding: 10px;
        // box-sizing: border-box;
        color: white;
        border-radius: 10px;
        border: none;
        font-weight: bold;
        font-size: 17px;
        background-color: #49A8FF;

        &:hover {
            background-color: #70bbff;
            cursor: pointer;
        }
    `

    return (
        <main className="mainDashboardStyle" css={mainDashboardStyle}>
            <div className="navSide" css={navSide}>
                <p>Dashboard</p>
            </div>
            <div className="contentSide">
                <div className="documentationBox" css={documentationBoxStyle}>
                    <div className="documentationContent" css={documentationContentStyle}>
                        <h2>Documentation</h2>
                        <p>This website is used for a <u>documentation</u> of students{'’'} enrichment records and internal enrichment activities.</p>
                    </div>
                    <img src={dashboardDocum} alt="" />
                </div>
                <div className="bottomBox" css={bottomBoxStyle}>
                    <div className="companyBox" css={companyBox}>
                        <h1>Company</h1>
                        <p>For companies, you can see all of your students in the <u>student list page</u> and add <u>comments</u> according to their performance and behaviour.
                        Please be <u>appropriate</u> when using the feature.</p>
                        <button className="buttonStyle" css={buttonStyle} onClick={() => setActiveTab('Student List')}>Go to Student List {">>"}</button>
                    </div>
                    <div className="enrichmentBox" css={companyBox}>
                        <h1>Enrichment</h1>
                        <p>For the enrichment team, other than comments, you can schedule a <u>meeting</u> to it to respond.
                        You can also use the <u>documentation page</u> to <u>log past events</u> in the enrichment team.</p>
                        <button className="buttonStyle" css={buttonStyle} onClick={() => setActiveTab('Documentation')}>Go to Documentation {">>"}</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardBox