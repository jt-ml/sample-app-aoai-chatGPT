import React, { useState } from "react";
import DropDown from "./JobPostingDropDown";

interface Props {
    onChanged: (jobId: string) => void;
}

export const JobPostingMenu = ({onChanged} : Props) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectJob, setSelectJob] = useState<string>("");
    const jobs = () => {
        return {"002": "Software Development Analyst", 
        "003": "Cybersecurity Architect",
        "004": "Technology Architect, Cloud & Data Centre"}
    };

    /**
     * Toggle the drop down menu
     */
    const toggleDropDown = () => {
        setShowDropDown(!showDropDown);
    };

    /**
     * Hide the drop down menu if click occurs
     * outside of the drop-down element.
     *
     * @param event  The mouse event
     */
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowDropDown(false);
        }
    };

    /**
     * Callback function to consume the
     * job name from the child component
     *
     * @param job  The selected job
     */
    const jobSelection = (job: string): void => {
        setSelectJob(job);
        onChanged(job);
    };

    // return (
    //     <>
    //         <label htmlFor="jobSelection">Job posting:</label>
    //         { 
                    
    //             <select id="jobSelection">
    //                 {/* <option value="000">Null (#000)</option> */}
    //                 <option value="002" selected>Software Development Analyst (#002)</option>
    //                 <option value="001">Cybersecurity Architect (#003)</option>
    //                 <option value="003">Technology Architect, Cloud & Data Centre (#004)</option>
    //             </select>
    //         }
    //     </>
    // )
    return (
        <>
            <div className="announcement">
                <div>
                    {selectJob
                        ? `You selected ${selectJob}`
                        : "Select your Job Posting"}
                </div>
            </div>
            <button
                className={showDropDown ? "active" : undefined}
                onClick={(): void => toggleDropDown()}
                onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                    dismissHandler(e)
                }
            >
                <div>{selectJob ? "Job: " + selectJob : "Job: ..."} </div>
                {showDropDown && (
                    <DropDown
                        jobs={jobs()}
                        showDropDown={false}
                        toggleDropDown={(): void => toggleDropDown()}
                        jobSelection={jobSelection}
                    />
                )}
            </button>
        </>
    );
};

//export default Menu;
