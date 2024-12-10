/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainBox from "../Elementary/MainBox";

const uploadBoxStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 200px;
    width: 100%;
    height: 100%;
`;

const uploadContainerStyle = css`
    width: 60%;
    padding: 30px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
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
    margin-bottom: 20px;
    background-color: white;
`;

const plusIconContainerStyle = css`
    display: flex;
    // justify-content: center;
    // margin-top: 10px;
    margin-bottom : 20px;
`;

const plusIconStyle = css`
    font-size: 16px;
    // color: #49A8FF;
    cursor: pointer;
    background-color: #EBEBEB;
    padding: 10px;
    border-radius: 10px;

    &:hover {
        background-color: #d4d4d4;
    }
`;

const newPeriodSectionStyle = css`
    margin-top: 20px;
    display: flex;

    margin-bottom: 20px;

    gap: 30px;
    // flex-direction: column;
`;

const UploadStudentData = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState();
    const [newPeriod, setNewPeriod] = useState("");
    const [isAddingPeriod, setIsAddingPeriod] = useState(false);
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
        if (!newPeriod.trim()) {
            alert("Please enter a valid period name.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/periods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newPeriod }),
            });

            if (response.ok) {
                const addedPeriod = await response.json();
                setPeriods((prevPeriods) => [...prevPeriods, addedPeriod]);
                setNewPeriod("");
                setIsAddingPeriod(false);
                alert("New period added successfully!");
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error adding new period:", error);
            alert("An error occurred while adding the period.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        if (!selectedPeriod) {
            alert("Please select a period.");
            return;
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
                alert("File uploaded successfully!");
                navigate("/enrichment-documentation/workspaces/dashboard");
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred during file upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <MainBox navText="Upload Student Data">
                    <div css={uploadBoxStyle}>
                        <div css={uploadContainerStyle}>
                            <h2>Upload Student Data</h2>
                            <div>
                                <select
                                    value={selectedPeriod}
                                    onChange={handlePeriodChange}
                                    css={selectStyle}
                                >
                                    <option value="">Select a Period</option>
                                    {periods.map((period) => (
                                        <option key={period.id} value={period.name}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                                <div css={plusIconContainerStyle}>
                                    <span css={plusIconStyle} onClick={toggleAddPeriod}>
                                        ➕ Add Period
                                    </span>
                                </div>
                            </div>
                            {isAddingPeriod && (
                                <div css={newPeriodSectionStyle}>
                                    <input
                                        type="text"
                                        placeholder="Enter new period name"
                                        value={newPeriod}
                                        onChange={handleNewPeriodChange}
                                        css={inputStyle}
                                    />
                                    <button onClick={handleAddPeriod} css={buttonStyle}>
                                        Add Period
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".csv, .xlsx, .xls"
                                onChange={handleFileChange}
                                css={inputStyle}
                            />
                            <button
                                onClick={handleUpload}
                                css={buttonStyle}
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Upload Data"}
                            </button>
                        </div>
                    </div>
                </MainBox>
            </div>
        </div>
    );
};

export default UploadStudentData;
