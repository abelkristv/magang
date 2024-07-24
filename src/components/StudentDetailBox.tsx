/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Student from "../model/Student";

interface StudentDetailBoxProps {
    studentId: string;
}

const StudentDetailBox = ({ studentId }: StudentDetailBoxProps) => {
    const userAuth = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
        0: 0,
    });
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentDoc = await getDoc(doc(collection(db, "student"), studentId));
                if (studentDoc.exists()) {
                    const data = studentDoc.data();
                    setStudent({
                        iden: studentDoc.id,
                        name: data.name,
                        nim: data.nim,
                        tempat_magang: data.tempat_magang,
                        semester: data.semester,
                        email: data.email,
                        phone: data.phone,
                        image_url: data.image_url,
                        status: data.status,
                        major: data.major,
                        faculty_supervisor: data.faculty_supervisor,
                        site_supervisor: data.site_supervisor,
                    } as Student);
                } else {
                    console.error("No such student!");
                }
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };
        fetchStudent();
    }, [studentId]);

    useEffect(() => {
        const fetchReports = async () => {
            if (student && student.name) {
                const reportsQuery = query(collection(db, "studentReport"), where("studentName", "==", student.name));
                const reportSnapshot = await getDocs(reportsQuery);
                const reportList = reportSnapshot.docs.map(doc => doc.data());
                setReports(reportList);

                const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
                let totalRating = 0;
                reportList.forEach(report => {
                    const rating = parseInt(report.rating, 10);
                    counts[rating] = (counts[rating] || 0) + 1;
                    totalRating += rating;
                });
                setRatingCounts(counts);
                setAverageRating(totalRating / reportList.length);
            }
        };
        fetchReports();
    }, [student]);

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        display: flex;
        justify-content: space-between;
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const contentSide = css`
        margin-top: 50px;
    `;

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;

        img {
            width: 220px;
            height: 260px;
            object-fit: cover;
            border-radius: 10px 0px 0px 10px;
        }
    `;

    const userDescStyle = css`
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: left;
        padding: 20px;
    `;

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        color: black;
    `;

    const informationStyle = css`
        margin-top: 20px;
        color: #51587E;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

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
    `;

    const greaterInformationContainerStyle = css`
        display: flex;
        justify-content: space-between;

        .left-side {
            width: 50%;
        }

        .right-side {
            width: 45%;
        }
    `;

    const filterStyle = css`
        display: flex;
        gap: 10px;
    `;

    const ratingShowcaseStyle = css`
        margin-top: 30px;
        .rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .rating-value {
            font-size: 16px;
            color: #FFA000;
        }
    `;

    const barChartStyle = css`
        margin-top: 30px;
        text-align: start;
        display: flex;
        flex-direction: column;
        .bar {
            display: flex;
            align-items: center;
            .bar-label {
                width: 50px;
            }
            .bar-value {
                height: 10px;
                background-color: #FFA000;
                margin-left: 10px;
            }
        }
    `;

    const getBarWidth = (count: number, total: number) => {
        if (total === 0) return '0%';
        const percentage = (count / total) * 100;
        return `${percentage}%`;
    };

    const barValueStyle = css`
        background-color: #49A8FF;
        height: 100%;
        border-radius: 10px;
    `;

    const ratingContainerStyle = css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        h1 {
            margin: 0px;
        }
        .averageRating {
            width: 10%;
            font-size: 68px;
            font-weight: regular;
            text-align: start;
            display: flex;
            align-items: center;
            margin: 0px;
        }

        .barChart {
            width: 82%;
            margin: 0px;
        }
    `;

    const bottomContentContainerStyle = css`
        display: flex;
        margin-top: 40px;
        gap: 50px;
        .left-side {
            width: 60%;
        }

        .right-side {
            width: 40%;
        }
    `;

    const dropdownStyle = css`
        position: relative;
        display: flex;
        background-color: #EBEBEB;
        padding: 10px;
        width: 200px;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        cursor: pointer;
    `;

    const dropdownContentStyle = css`
        display: ${isDropdownOpen ? 'flex' : 'none'};
        flex-direction: column;
        gap: 20px;
        font-size: 18px;
        background-color: #EBEBEB;
        text-align: start;
        position: absolute;
        top: 120%;
        left: -49%;
        width: 400px;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10;

        .inputText {
            width: 30px;
        }

        .time {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .rating {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    `;

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRating(parseInt(event.target.value));
    };

    const addRecordBoxStyle = css`
        width: 100%;
        border: 1px solid #ebebeb;
        height: 100%;
        display: flex;
        flex-direction: column;
        p {
            text-align: start;
        }
        .headerp {
            background-color: #ebebeb;
            margin: 0px;
            font-size: 20px;
            font-weight: 600;
            padding: 5px;
            text-align: center;
        }
    `;

    const recordFormStyle = css`
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        p {
            font-weight: 500;
        }
    `;

    const radioButtonsStyle = css`
        display: flex;
        gap: 10px;

        label {
            display: flex;
            align-items: center;
            gap: 5px;
        }
    `;

    const buttonStyle = css`
        border: none;
        background-color: #49A8FF;
        padding: 10px;
        color: white;
        border-radius: 10px;
        font-weight: 600;
        font-size: 20px;
        margin-top: 40px;
    `

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Student Detail</p>
                <div className="filter" css={filterStyle}>
                    <p>Filter : </p>
                    <select name="" id="">
                        <option value="">Odd Semester 23.10</option>
                    </select>
                </div>
            </div>
            <div className="contentSide" css={contentSide}>
                <div className="userCard" css={userCardStyle}>
                    {student && (
                        <>
                            <img src={student.image_url} alt={student.name} />
                            <div className="userDesc" css={userDescStyle}>
                                <h1>{student.name}</h1>
                                <p style={{ color: "#51587E" }}>{student.nim}</p>
                                <div className="greaterInformationContainer" css={greaterInformationContainerStyle}>
                                    <div className="left-side">
                                        <div className="information" css={informationStyle}>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"mdi:college-outline"} fontSize={20} />
                                                    <p>Major</p>
                                                </div>
                                                <p>{student.major}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ph:building-bold"} fontSize={20} />
                                                    <p>Organization Name</p>
                                                </div>
                                                <p>{student.tempat_magang}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ic:outline-email"} fontSize={20} />
                                                    <p>Email Address</p>
                                                </div>
                                                <p>{student.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-side">
                                        <div className="information" css={informationStyle}>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"material-symbols:supervisor-account"} fontSize={20} />
                                                    <p>Faculty Supervisor</p>
                                                </div>
                                                <p>{student.faculty_supervisor}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ic:outline-people"} fontSize={20} />
                                                    <p>Site Supervisor</p>
                                                </div>
                                                <p>{student.site_supervisor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                
                <div className="bottomContentContainer" css={bottomContentContainerStyle}>
                    <div className="left-side">
                        <div className="recordsContainer" style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                            <h2 style={{textAlign: "left", marginBottom: "0px"}}>Records</h2>
                            <div className="filterContainer" style={{display: "flex", alignItems: "center", gap: "20px", position: "relative"}}>
                                <p>Filter : </p>
                                <div className="dropdown" css={dropdownStyle} onClick={handleDropdownClick}>
                                    <p>All Records</p>
                                    <Icon icon={"weui:arrow-filled"} rotate={45} />
                                </div>
                                <div className="dropdown-content" css={dropdownContentStyle}>
                                    <div className="time">
                                        <p>Time</p>
                                        <div className="timeOptionContainer" style={{display: "flex", justifyContent: "space-between"}}>
                                            <div className="startTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>Start</p>
                                                <input type="date" /> 
                                            </div>
                                            <div className="endTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>End</p>
                                                <input type="date" /> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        <p>Rating</p>
                                        <div className="timeOptionContainer" style={{display: "flex", gap: "20px"}}>
                                            <div className="startTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>From</p>
                                                <input type="text" className="inputText"/> 
                                            </div>
                                            <div className="endTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>To</p>
                                                <input type="text" className="inputText" /> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reports.length > 0 && (
                            <div className="ratingContainerStyle" css={ratingContainerStyle}>
                                <div className="averageRating" css={css`margin-top: 30px;`}>
                                    <p>{averageRating ? averageRating.toFixed(2) : "N/A"}</p>
                                </div>
                                <div className="barChart" css={barChartStyle}>
                                    {Object.keys(ratingCounts).map(rating => (
                                        <div key={rating} className="bar">
                                            <div className="bar-label">{rating}</div>
                                            <div
                                                className="bar-value" css={barValueStyle}
                                                style={{ width: "100%", borderRadius: "10px", backgroundColor: "#F0ECEC" }}
                                            >
                                                <div className="barValueBg" css={barValueStyle} style={{ width: getBarWidth(ratingCounts[rating], reports.length) }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="right-side">
                        <div className="add-a-record-box" css={addRecordBoxStyle}>
                            <p className="headerp">Add a record</p>
                            <div className="recordForm" css={recordFormStyle}>
                                <p>Description</p>
                                <textarea name="" id="" rows={10}></textarea>
                                <p>Rating</p>
                                <div className="radioButtons" css={radioButtonsStyle}>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <label key={rating}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={rating}
                                                checked={selectedRating === rating}
                                                onChange={handleRatingChange}
                                            />
                                            {rating}
                                        </label>
                                    ))}
                                </div>
                                <button className="button" css={buttonStyle}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default StudentDetailBox;
