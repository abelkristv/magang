/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getAuth, updateEmail, sendEmailVerification } from 'firebase/auth';
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import User from "../model/User";
import { fetchUserAndCompanies } from "../controllers/UserController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { match, Option } from "fp-ts/lib/Option";
import { fetchAllMajors } from "../controllers/MajorController";
import { fetchRecordsAndDocumentation } from "../controllers/ReportController";
import notFoundImage from "../assets/not_found.png";
import { fetchAllCompanies } from "../controllers/CompanyController";
import { fetchPeriods } from "../controllers/PeriodController";
import { InfoContainer } from "./StudentDetail/StudentDetailBox.styles";

interface ProfileBoxProps {
    setTodayReportsCount: (count: number) => void;
}

interface Record {
    timestamp: Date;
    studentName: string;
    type: string;
    writer: string;
    report: string;
    person: string;
    studentData: {
        imageUrl?: string;
        nim?: string;
        tempatMagang?: string;
        facultySupervisor?: string;
        siteSupervisor?: string;
        major?: string;
        period: string;
    };
    imageUrl?: string;
    major?: string;
    meetings?: any[];
}

interface Documentation {
}

const ProfileBox: React.FC<ProfileBoxProps> = ({ setTodayReportsCount }) => {
    const userAuth = useAuth();
    const [user, setUser] = useState<User>({} as User);
    const [companyAddress, setCompanyAddress] = useState<string | undefined>();
    const [allRecords, setAllRecords] = useState<Record[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
    const [_documentations, setDocumentations] = useState<Documentation[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState<User>({} as User);
    const [isLoading, setIsLoading] = useState(true);

    const [majors, setMajors] = useState<string[]>([]);
    const [companies, setCompanies] = useState<string[]>([]); // New state for companies
    const [periods, setPeriods] = useState<string[]>([]); // New state for periods
    const [selectedMajor, setSelectedMajor] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<string>(""); // New state for selected company
    const [selectedPeriod, setSelectedPeriod] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tempSelectedMajor, setTempSelectedMajor] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
    
            const { userFetched, companyAddress } = await fetchUserAndCompanies(userAuth?.currentUser?.email);
            if (userFetched) {
                // console.log("Fetched user: ", userFetched);
                setUser(userFetched);
                setEditableUser(userFetched);
                setCompanyAddress(companyAddress);
    
                const { records, documentations } = await fetchRecordsAndDocumentation(userFetched);
                setAllRecords(records);
                setFilteredRecords(records);
                setDocumentations(documentations);
    
                setTodayReportsCount(records.length);
            }
    
            setIsLoading(false);
        };
    
        fetchData();
    }, [setTodayReportsCount, userAuth?.currentUser?.email]);

    useEffect(() => {
        const fetchFilters = async () => {
            const majorResult: Option<any[]> = await fetchAllMajors();
            match(
                () => console.error("No majors found"),
                (majorsList: any[]) => setMajors(majorsList.map((major) => major.name))
            )(majorResult);

            const companyResult = await fetchAllCompanies().then(company => company._tag == "Some" ? company.value : {} as Company[]); // Fetch companies
            setCompanies(companyResult.map((company: Company) => company.company_name));

            const periodResult = await fetchPeriods(); // Fetch periods
            setPeriods(periodResult.map((period: string) => period));
        };

        fetchFilters();
    }, []);
    
    useEffect(() => {
        // console.log("Editable user (updated): ", editableUser); // This will log the updated state
        setIsLoading(false)
    }, [editableUser]);
    

    useEffect(() => {
        const fetchMajors = async () => {
            const result: Option<Major[]> = await fetchAllMajors();

            match(
                () => {
                    console.error("No majors found");
                },
                (majorsList: Major[]) => {
                    const majorNames = majorsList.map((major) => major.name);
                    setMajors(majorNames);
                }
            )(result);
        };

        fetchMajors();
    }, []);

    const handleEditClick = async () => {
        if (isEditing) {
            if (editableUser) {
                try {
                    if (!editableUser.image_url && user.image_url) {
                        editableUser.image_url = user.image_url;
                    }
    
                    // Check if the email has changed
                    if (editableUser.email !== user.email) {
                        const auth = getAuth(); // Initialize Firebase Auth
                        const currentUser = auth.currentUser;
    
                        if (currentUser) {
                            // Send email verification to the new email address
                            await sendEmailVerification(currentUser);
                            alert('Please verify the new email address. A verification email has been sent.');
    
                            return; // Do not proceed with the email update until the email is verified
                        } else {
                            throw new Error('User is not authenticated.');
                        }
                    }
    
                    // Send the updated user data to your backend
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/user/${editableUser.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editableUser),
                    });
                    
                    const fetchedUser = await response.json();
                    const updatedUser: User = {
                        id: fetchedUser.id,
                        email: fetchedUser.email,
                        image_url: fetchedUser.imageUrl,
                        company_name: fetchedUser.companyName,
                        name: fetchedUser.name,
                        role: fetchedUser.role,
                        phone_number: fetchedUser.phoneNumber,
                    };
    
                    // Update the local user state
                    setUser(updatedUser);
                    userAuth?.setCurrentUser(updatedUser); // Update the Firebase Auth context or state if needed
                    setEditableUser(updatedUser);
                    setIsEditing(false);
                } catch (error) {
                    console.error('Failed to update user:', error);
                    alert('Error saving changes, please try again');
                }
            }
        } else {
            setIsEditing(true);
        }
    };

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        setEditableUser(prevState => {
            if (prevState) {
                return { ...prevState, [name]: value };
            }
            console.error('Editable user is undefined');
            return prevState;
        });
    };

    const handleMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempSelectedMajor(event.target.value);
    };

    const handleApplyFilters = () => {
        let filtered = allRecords;
    
        if (tempSelectedMajor) filtered = filtered.filter(record => record.major === tempSelectedMajor);
        if (selectedCompany) filtered = filtered.filter(record => record.studentData.tempatMagang === selectedCompany);
    
        if (selectedPeriod) {
            const periodNumber = selectedPeriod.split(' ').pop();
            filtered = filtered.filter(record => record.studentData.period === periodNumber);
        }
    
        setFilteredRecords(filtered);
        setIsDropdownOpen(false);
    };
    

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleFilterChange = (filterType: string, value: string) => {
        if (filterType === "major") setTempSelectedMajor(value);
        if (filterType === "company") setSelectedCompany(value);
        if (filterType === "period") setSelectedPeriod(value);
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 40px 15px 40px 43px;
        box-sizing: border-box;
    `;

    const navSide = css`
        width: 98%;
        max-height: 10px;
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const headerTop = css`
        font-weight: 300;
    `;

    const loadingWidth = css`
        max-height: 155px;
    `;

    const contentSide = css`
        margin-top: 37px;
    `;

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 100%;

        img {
            min-width: 145px;
            width: 155px;
            height: 185px;
            object-fit: cover;
            border-radius: 10px 0px 0px 10px;
        }
    `;

    const userDescStyle = css`
        display: flex;
        align-items: center;
        gap: 75px;
        text-align: left;
    `;

    const userDesc2Style = css`\
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 15px 15px 15px;
        box-sizing: border-box;
        text-align: left;
    `;

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 0.7fr 1fr;
        width: 100%;
        color: black;

        input {
            width: 100%;
            font-size: 20px;
            margin: 0px;

            &:focus {
                outline: none;
            }
        }

        p {
            font-size: 16px;
        }
    `;

    const informationStyle = css`
        color: #51587E;
        display: flex;

        .column {
            display: flex;
            width: 500px;
            flex-direction: column;
            gap: 5px;
        }
    `;

    // const buttonSideStyle = css`
    //     display: flex;
    //     margin-top: 30px;
    //     gap: 10px;

    //     button {
    //         border: 1px solid #DCDCDC;
    //         padding: 10px;
    //         background-color: white;
    //         border-radius: 10px;
    //         font-size: 17px;
    //         font-weight: medium;
    //         cursor: pointer;
    //         &:hover {
    //             background-color: #dcdcdc;
    //         }
    //     }
    // `;

    const bottomContentStyle = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 30px;
        .bottomContainer {
            width: 100%;
            .heading {
                display: flex;
                justify-content: space-between;
                font-weight: medium;
            }

            .fixTextWeight{
                font-weight: 600;
            }

            .filterMajor {
                display: flex;
                gap: 10px;
                position: relative;
            }
        }
    `;

    const recentlyAddedRecordsContainerStyle = css`
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 2px;
        box-sizing: border-box;
        overflow: auto;
        scrollbar-width: thin;
        height: 685px;

        .recordCard {
            display: flex;
            flex-direction: row;
            box-shadow: 1px 1px 4px 3px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: white;
            align-items: center;
            height: 160px;
        }
    `;

    const placeholderStyle = css`
        background-color: white;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;
        min-height: 155px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .line {
            width: 80%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
        }

        .circle {
            width: 100px;
            height: 100px;
            background-color: #e0e0e0;
            border-radius: 50%;
        }
    `;

    const dropdownStyle = css`
        padding: 10px;
        box-sizing: border-box;
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        width: 242px;
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            font-size: 15px;
        }
    `;

    const dropdownContentStyle = css`
        display: ${isDropdownOpen ? 'block' : 'none'};
        position: absolute;
        background-color: #EBEBEB;
        top: 120%;
        left: -30%;
        text-align: start;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 120%;
        z-index: 1;

        p {
            margin: 0;
            padding: 10px 0px 10px 0px;
            cursor: pointer;
            font-size: 16px;
        }

        select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: white;
            font-size: 15px;
            cursor: pointer;
        }
    `;

    // const recordCard = css``;

    const cardStyle = css`
        height: 100%;
    `;

    const editInputStyle = css`
        border: none;
        width: 258px !important;
        border-bottom: 1px solid gray;
        padding: 0px;
        font-size: 16px !important;
    `;

    const totalStyle = css`
        font-size: 25px;
        font-weight: 600;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 700px;
        img {
            height: 300px;
            width: 300px;
        }
        p{
            margin-top: 10px;
        }
    `;

    const buttonContainerStyle = css`
        display: flex;
        flex-direction: column;
        align-items: end;
    `;

    const buttonStyle = css`
        border: none;
        background-color: #49A8FF;
        padding: 10px 20px;
        color: white;
        border-radius: 10px;
        font-weight: 500;
        font-size: 17px;
        margin-top: 30px;
        width: auto;

        &:hover {
            cursor: pointer;
            background-color: #309CFF;
        }
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            {isLoading ? (
                <div className="navSide" css={navSide}>
                    <div css={loadingWidth}>
                        <p css={headerTop}>Profile</p>
                        <div className="contentSide" css={contentSide}>
                            <div className="placeholder" css={placeholderStyle}>
                                <div className="circle"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : editableUser && (
                <div className="navSide" css={navSide}>
                    <p css={headerTop}>Profile</p>
                    <div className="contentSide" css={contentSide}>
                        <div className="userCard" css={userCardStyle}>
                            {/* <img src={user?.image_url} alt="" /> */}
                            <div className="userDesc" css={userDesc2Style}>
                                <div css={userDescStyle}>
                                    <div>
                                        <div className="nameHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1px" }}>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editableUser?.name}
                                                    onChange={handleChange}
                                                    style={{
                                                        fontWeight: "600",
                                                        fontSize: "18px",
                                                        border: "none",
                                                        width: "wrap-content !important",
                                                        borderBottom: "1px solid gray",
                                                        padding: "0px",
                                                    }}
                                                />
                                            ) : (
                                                <p style={{ fontWeight: "600", fontSize: "18px" }}>{user?.name}</p>
                                            )}
                                        </div>
                                        {/* <p style={{ color: "#51587E", fontWeight: "500", fontSize: "16px" }}>{editableUser?.role === "Company" ? "Site Supervisor" : "Enrichment SOCS"}</p> */}
                                        <p style={{ color: "#51587E", fontWeight: "500", fontSize: "16px" }}>Enrichment SOCS</p>
                                    </div>
                                    <div className="information" css={informationStyle}>
                                        <div className="column">
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                    <Icon icon={"ic:outline-email"} fontSize={24} />
                                                    <p>Email address</p>
                                                </div>
                                                {isEditing ? (
                                                    <input type="text" name="email" value={editableUser?.email} onChange={handleChange} css={editInputStyle} />
                                                ) : (
                                                    <p>{editableUser?.email}</p>
                                                )}
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                    <Icon icon={"ic:outline-phone"} fontSize={24} />
                                                    <p>Phone number</p>
                                                </div>
                                                {isEditing ? (
                                                    <input type="text" name="phone_number" value={editableUser?.phone_number} onChange={handleChange} css={editInputStyle} />
                                                ) : (
                                                    <p>{editableUser?.phone_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        {/* <div className="column" style={{ width: "600px" }}>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                    <Icon icon={"ph:building-bold"} fontSize={24} />
                                                    <p>Company Name</p>
                                                </div>
                                                <p>{editableUser?.company_name}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "20px" }}>
                                                    <Icon icon={"entypo:address"} fontSize={24} />
                                                    <p>Company Address</p>
                                                </div>
                                                <p style={{ width: "130%", textAlign: "justify" }}>{companyAddress}</p>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div>
                                    {isEditing ? (
                                            <Icon icon={"mingcute:check-line"} fontSize={30} onClick={handleEditClick} style={{ cursor:'pointer' }} />
                                        ) : (
                                            <Icon icon={"mingcute:edit-line"} fontSize={30} onClick={handleEditClick} style={{ cursor:'pointer' }} />
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottomContent" css={bottomContentStyle}>
                        <div className="bottomContainer">
                            <div className="heading">
                                <div className="pContainer" style={{ display: "flex", alignItems: "center" }}>
                                    <p style={{ fontWeight: "600", fontSize: "19px" }}>Unresolved Urgent Student Records</p>
                                </div>
                                <div className="righSide" style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>
                                    <p style={{ fontSize: '15px' }}>Filter by: </p>
                                    <div className="filterMajor" css={dropdownStyle} onClick={toggleDropdown}>
                                        <p>{selectedMajor || "All Majors"}</p>
                                        <Icon icon={"weui:arrow-filled"} rotate={45} fontSize={10} />
                                    </div>
                                    {isDropdownOpen &&
                                        <div className="dropdown-content" css={dropdownContentStyle}>
                                            <p>Major</p>
                                            <select value={tempSelectedMajor} onChange={(e) => handleFilterChange("major", e.target.value)}>
                                                <option value="">All</option>
                                                {majors.map((major, index) => (
                                                    <option key={index} value={major}>{`${major}`}</option>
                                                ))}
                                            </select>

                                            {/* Company Filter
                                            <p style={{marginTop:"13px"}}>Company</p>
                                            <select value={selectedCompany} onChange={(e) => handleFilterChange("company", e.target.value)}>
                                                <option value="">All</option>
                                                {companies.map((company, index) => (
                                                    <option key={index} value={company}>{`${company}`}</option>
                                                ))}
                                            </select> */}

                                            {/* Period Filter */}
                                            <p>Period</p>
                                            <select value={selectedPeriod} onChange={(e) => handleFilterChange("period", e.target.value)}>
                                                <option value="">All</option>
                                                {periods.map((period, index) => (
                                                    <option key={index} value={period}>{`${period}`}</option>
                                                ))}
                                            </select>

                                            {/* <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", marginTop: "30px" }}>
                                                <button onClick={handleApplyFilters} style={{ backgroundColor: "#49A8FF" }}>Apply</button>
                                            </div> */}
                                            <div css={buttonContainerStyle}>
                                                <button className="button" css={buttonStyle} onClick={handleApplyFilters}>Apply</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="recentlyAddedRecordsContainer" css={recentlyAddedRecordsContainerStyle}>
                                {filteredRecords.length === 0 ? (
                                    <div css={totalStyle}>
                                        <img src={notFoundImage} alt="No Student Found" />
                                        <p>No Urgent Student Records Found</p>
                                    </div>
                                ) : (
                                    filteredRecords.map((record, index) => {
                                        // const { time, date } = formatDate(record.timestamp);
                                        console.log("record : " , record)
                                        // const timestamp = new Date(record.timestamp);
                                        const formattedDate = record.timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                        const formattedTime = record.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                        return (
                                            <div key={index} className="recordCard">
                                                {record.imageUrl && <img src={record.imageUrl} alt={record.studentName} style={{ height: "7px" }} />}
                                                <div style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    boxSizing: "border-box",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    paddingRight: "15px",
                                                    paddingTop: "10px",
                                                    paddingLeft: "15px",
                                                    gap: "10px"
                                                }}>
                                                    <div css={cardStyle} className="leftSide" style={{
                                                        width: "100%",
                                                        paddingTop: "0px",
                                                        borderRight: '1px solid #ACACAC'
                                                    }}>
                                                        <div className="name-header" style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                                            <p style={{ fontSize: "17.5px", fontWeight: "500" }}>{record.studentName}</p>
                                                            <p style={{ fontSize: "15px", fontWeight: "500", color: "#51587E" }}>{record.studentData.nim}</p>
                                                            <div className="studentInfoContainer" style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "10px",
                                                                marginTop: "10px"
                                                            }}>
                                                                <div style={{ display: 'flex', flexDirection: "column", gap: "5px" }}>
                                                                    <div className="studentInfoContent" style={{
                                                                        display: "flex",
                                                                        alignItems: "start"
                                                                    }}>
                                                                        <div style={{display:'flex', gap:'16px', width:'230px'}}>
                                                                            <Icon icon={"ph:building-bold"} fontSize={20} color="#51587E" />
                                                                            <p style={{ fontSize: "15px", color: "#51587E" }}>Organization Name</p>
                                                                        </div>
                                                                        <p style={{ fontSize: "15px", color: "black" }}>{record.studentData.tempatMagang}</p>
                                                                    </div>
                                                                    {/* <InfoContainer>
                                                                        <div style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "16px" }}>
                                                                            <Icon icon={"ph:building-bold"} fontSize={22} />
                                                                            <p style={{width:"190px"}}>Organization Name</p>
                                                                        </div>
                                                                        <p style={{fontWeight: "500"}}>{record.studentData.tempatMagang}</p>
                                                                    </InfoContainer> */}
                                                                    <div className="studentInfoContent" style={{
                                                                        display: "flex",
                                                                        alignItems: "start"
                                                                    }}>
                                                                        <div style={{display:'flex', gap:'16px', width:'230px'}}>
                                                                            <Icon icon={"material-symbols:supervisor-account"} fontSize={20} color="#51587E" />
                                                                            <p style={{ fontSize: "15px", color: "#51587E" }}>Faculty Supervisor</p>
                                                                        </div>
                                                                        <p style={{ fontSize: "15px", color: "black" }}>{record.studentData.facultySupervisor}</p>
                                                                    </div>
                                                                    <div className="studentInfoContent" style={{
                                                                        display: "flex",
                                                                        alignItems: "start"
                                                                    }}>
                                                                        <div style={{display:'flex', gap:'16px', width:'230px'}}>
                                                                            <Icon icon={"ic:outline-people"} fontSize={20} color="#51587E" />
                                                                            <p style={{ fontSize: "15px", color: "#51587E" }}>Site Supervisor</p>
                                                                        </div>
                                                                        <p style={{ fontSize: "15px", color: "black" }}>{record.studentData.siteSupervisor}</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rightSide" style={{ position: "relative", width: "60%", paddingLeft: "10px", height: "100%", boxSizing: "border-box" }}>
                                                        <div style={{
                                                            marginBottom: "10px",
                                                            marginTop: "3px",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            height: "100%",
                                                        }}>
                                                            <div className="record-header" style={{
                                                                display: "flex",
                                                                gap: "20px",
                                                                justifyContent: "space-between"
                                                            }}>
                                                                <p style={{ fontSize: "16px", fontWeight: "500" }}>{record.writer}</p>
                                                                <p
                                                                    style={{
                                                                        position: "absolute",
                                                                        right: "0px",
                                                                        top: "5px",
                                                                        backgroundColor: record.type === 'Report' ? '#A024FF' : record.type === 'Urgent' ? 'red' : 'orange',
                                                                        color: 'white',
                                                                        fontWeight: '500',
                                                                        padding: '2px',
                                                                        borderRadius: '10px',
                                                                        fontSize: "15px",
                                                                        width: '75px',
                                                                        textAlign: 'center',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    {record.type}
                                                                </p>
                                                            </div>
                                                            <div className="additional-header">
                                                                <p style={{
                                                                    fontSize: "14px",
                                                                    fontStyle: "italic",
                                                                    color: "#51587E"
                                                                }}>By {record.person} - {formattedTime}, {formattedDate}</p>
                                                            </div>
                                                            <div className="content">
                                                                <p style={{
                                                                    color: "#5F6368",
                                                                    fontSize: "16px",
                                                                    marginTop: "13px"
                                                                }}>{record.report}</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="bottomSide">
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default ProfileBox;
