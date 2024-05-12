import React, { useEffect, useState } from 'react';

type DropDownProps = {
    //jobs: string[];
    jobs: {};
    showDropDown: boolean;
    toggleDropDown: Function;
    jobSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
    jobs,
    jobSelection,
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    /**
     * Handle passing the city name
     * back to the parent component
     *
     * @param city  The selected city
     */
    const onClickHandler = (job: string): void => {
        jobSelection(job);
    };

    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);

    return (
        <>
            <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
                {Object.keys(jobs).map(
                    (key: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(key);
                                }}
                            >
                                {key}
                            </p>
                        );
                    }
                )}
                {/* {jobs.map(
                    (city: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(city);
                                }}
                            >
                                {city}
                            </p>
                        );
                    }
                )} */}
            </div>
        </>
    );
};

export default DropDown;
