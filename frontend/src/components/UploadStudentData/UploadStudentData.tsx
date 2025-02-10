/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainBox from "../Elementary/MainBox";
import { Button, Header } from "../Documentation/Add New Documentation/AddNewDocumentationBox.styles";
import Period from "../../model/Period";
import SuccessPopup from "../Elementary/SuccessPopup";
import FailedPopup from "../Elementary/FailedPopup";

const uploadBoxStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
    margin-left: 400px;
    width: 50%;
    height: 100%;
`;

const uploadContainerStyle = css`
    width: 100%;
    // padding: 30px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    border: 1px solid #ebebeb;
    text-align: start;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
    // width: 1300px;
`;

const inputStyle = css`
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
`;

const buttonStyle = css`
    background-color: #49A8FF;
    padding: 12px;
    color: white;
    font-size: 16px;
    border: none;
    height: 50px;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
    width: 200px;

    &:hover {
        background-color: #70bbff;
    }
`;

const selectStyle = css`
    padding: 10px;
    width: 100%;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 7px;
    background-color: white;
`;

const plusIconContainerStyle = css`
    display: flex;
    // justify-content: center;
    // margin-top: 10px;
    margin-bottom : 20px;
`;

const newPeriodSectionStyle = css`
    display: flex;
    align-items: end;
    margin-bottom: 20px;
    gap: 30px;
`;

const newPeriodFieldStyle = css`
    width: 100%;
    p {
        margin: 0;
        padding: 10px 0px 10px 0px;
        cursor: pointer;
    }

    select {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: white;
        font-size: 15px;
        cursor: pointer;
    }
`;

const newPeriodStartYearFieldStyle = css`
    width: 100%;
    p {
        margin: 0;
        padding: 10px 0px 10px 0px;
        cursor: pointer;
    }

    input {
        padding: 0px 10px;
        font-size: 15px;
        box-sizing: border-box;
        width: 100%;
        height: 46px;
        border-radius: 5px;
        border: 1px solid #ACACAC;
    }
`;

const pictureDivStyle = css`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: 0px 0px;
    p{
        margin-top: 10px;
        margin-bottom: 10px;
    }
`;

const inputContainerStyle = css`
    display: flex;
    align-items: center;
    border: 1px solid #ACACAC;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    height: 40px;
    position: relative;
`;
const hiddenFileInputStyle = css`
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
`;
const browseButtonStyle = css`
    background-color: #F0ECEC;
    border-radius: 0 5px 5px 0;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-left: 679px;
    font-size: 15px;
`;

const errorStyle = css`
    color: red;
    margin-top: 4px;
    margin-bottom: 10px;
`;

const UploadStudentData = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [newPeriod, setNewPeriod] = useState("");
    const [newPeriodTerm, setNewPeriodTerm] = useState("odd");

    const [isAddingPeriod, setIsAddingPeriod] = useState(false);
    const [error, setError] = useState<string>("");
    const [periodError, setPeriodError] = useState<string>("");
    const [fileError, setFileError] = useState<string>("");
    const [isSuccess1Visible, setIsSuccess1Visible] = useState(false);
    const [isSuccess2Visible, setIsSuccess2Visible] = useState(false);
    const [isFailedVisible, setIsFailedVisible] = useState(false);
    const [failedPopUpMessage, setFailedPopUpMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/periods");
                const data = await response.json();
                setPeriods(data);
            } catch (error) {
                console.error("Failed to fetch periods:", error);
                alert("Failed to fetch periods. Please try again later.");
            }
        };

        fetchPeriods();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
        setSelectedPeriod(e.target.value);
    };

    const handleNewPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPeriod(e.target.value);
    };

    const toggleAddPeriod = () => {
        setIsAddingPeriod(!isAddingPeriod);
    };

    const handleAddPeriod = async () => {
        if (!newPeriod.trim() || isNaN(Number(newPeriod))) {
            setError("Invalid period start year");
            return;
        }
        else{
            setError("");
        }
    
        const yearLastTwoDigits = newPeriod.slice(-2);
        const semesterSuffix = newPeriodTerm === "odd" ? "10" : "20";
        const formattedPeriod = `${newPeriodTerm.charAt(0).toUpperCase() + newPeriodTerm.slice(1)} semester ${yearLastTwoDigits}.${semesterSuffix}`;
    
        try {
            const response = await fetch("http://localhost:3001/api/periods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formattedPeriod }),
            });
    
            if (response.ok) {
                const addedPeriod = await response.json();
                setIsSuccess1Visible(true);
                setTimeout(() => {
                    setIsSuccess1Visible(false);
                }, 5000);
                setPeriods((prevPeriods) => [...prevPeriods, addedPeriod]);
                setNewPeriod("");
                setNewPeriodTerm("odd");
                setIsAddingPeriod(false);
            } else {
                const result = await response.json();
                // alert(`Error: ${result.message}`);
                setFailedPopUpMessage(`${result.message}`);
                setIsFailedVisible(true);
                setTimeout(() => {
                    setIsFailedVisible(false);
                    setFailedPopUpMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error("Error adding new period:", error);
            // alert("An error occurred while adding the period.");
            setFailedPopUpMessage('An error occurred while adding the period');
            setIsFailedVisible(true);
            setTimeout(() => {
                setIsFailedVisible(false);
                setFailedPopUpMessage('');
            }, 5000);
        }
    };    

    const handleUpload = async () => {
        if (!selectedPeriod) {
            setPeriodError("Please select a period");
            if (!file) {
                setFileError("Please select a file");
            }
            return;
        }
        else{
            setPeriodError("");
        }

        if (!file) {
            setFileError("Please select a file");
            return;
        }
        else{
            setFileError("");
        }


        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("period", selectedPeriod);
        console.log(selectedPeriod)

        try {
            const response = await fetch("http://localhost:3001/api/upload-student-data", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSuccess2Visible(true);
                setTimeout(() => {
                    setIsSuccess2Visible(false);
                }, 5000);
                // navigate("/enrichment-documentation/workspaces/student");
            } else {
                const result = await response.json();
                // alert(`Error: ${result.message}`);
                setFailedPopUpMessage('Invalid file');
                setIsFailedVisible(true);
                setTimeout(() => {
                    setIsFailedVisible(false);
                    setFailedPopUpMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setFailedPopUpMessage('An error occurred while uploading the student data');
            setIsFailedVisible(true);
            setTimeout(() => {
                setIsFailedVisible(false);
                setFailedPopUpMessage('');
            }, 5000);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <MainBox navText="Upload">
                    <div css={uploadBoxStyle}>
                        <div css={uploadContainerStyle}>
                            <Header style={{padding:''}}>Upload Student Data</Header>
                            <div style={{padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <div style={{width:'100%'}}>
                                    <div>
                                        <p style={{fontWeight:'500', fontSize:'17px', marginBottom:'6px'}}>Period</p>
                                        <select
                                            value={selectedPeriod}
                                            onChange={handlePeriodChange}
                                            css={selectStyle}
                                        >
                                            <option value="">Select a Period</option>
                                            {periods.map((period) => (
                                                <option key={String(period.id)} value={String(period.name)}>
                                                    {period.name}
                                                </option>
                                            ))}
                                        </select>
                                        {periodError && <p css={errorStyle} style={{fontSize:"14px"}}>{periodError}</p>}
                                        <div css={plusIconContainerStyle}>
                                            <Button onClick={toggleAddPeriod} style={{paddingLeft:'20px', paddingRight:'20px', marginTop:'20px'}}>Add Period</Button>
                                        </div>
                                    </div>
                                    {isAddingPeriod && (
                                        <div css={newPeriodSectionStyle}>
                                            <div css={newPeriodFieldStyle}>
                                                <p style={{fontWeight:'500', fontSize:'17px'}}>Period Year</p>
                                                <select
                                                    value={newPeriodTerm}
                                                    onChange={(e) => setNewPeriodTerm(e.target.value)}
                                                    css={selectStyle}
                                                    style={{ height: "47px", marginBottom: "0px", border: "1px solid #ACACAC" }}
                                                >
                                                    <option value="odd">Odd</option>
                                                    <option value="even">Even</option>
                                                </select>

                                            </div>
                                            <div css={newPeriodStartYearFieldStyle}>
                                                <p style={{fontWeight:'500', fontSize:'17px'}}>Period Start Year</p>
                                                <input
                                                    type="text"
                                                    placeholder="ex: 2023"
                                                    value={newPeriod}
                                                    onChange={handleNewPeriodChange}
                                                >
                                                </input>
                                                {error && <p css={errorStyle} style={{fontSize:"14px"}}>{error}</p>}
                                            </div>

                                            <Button
                                                onClick={handleAddPeriod}
                                                style={{ marginTop: "40px", fontSize: "17px", fontWeight:"500", padding: "9px 25px 9px 25px", height:"45px", backgroundColor:'#49A8FF', color:'white' }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    )}

                                    <div css={pictureDivStyle}>
                                        <p style={{fontWeight:'500', fontSize:'17px', marginBottom:'6px'}}>Student Excel Data</p>
                                        <div css={inputContainerStyle}>
                                            <input
                                                id="hiddenFileInput"
                                                type="file"
                                                accept=".csv, .xlsx, .xls"
                                                css={hiddenFileInputStyle}
                                                onChange={handleFileChange}
                                            />
                                            {/* {fileName && (
                                                <div style={{position:"absolute", marginLeft:"10px", fontSize:"15px"}}>
                                                    {fileName}
                                                </div>
                                            )} */}
                                            <div css={browseButtonStyle}>Browse</div>
                                        </div>
                                        {fileError && <p css={errorStyle} style={{fontSize:"14px"}}>{fileError}</p>}
                                    </div>


                                </div>
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    style={{ marginTop: "40px", fontSize: "17px", fontWeight:"500", padding: "8px 70px 8px 70px", height:"45px", backgroundColor:'#49A8FF', color:'white' }}
                                >
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <SuccessPopup message='The new period has been successfully added' isVisible={isSuccess1Visible} />
                    <SuccessPopup message='The student data file has been successfully uploaded' isVisible={isSuccess2Visible} />
                    <FailedPopup isVisible={isFailedVisible} message={failedPopUpMessage} />
                </MainBox>
            </div>
        </div>
    );
};

export default UploadStudentData;
