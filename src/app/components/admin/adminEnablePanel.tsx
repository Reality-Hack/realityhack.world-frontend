import { default as HardwareIcon, default as ToolsIcon } from '@mui/icons-material/Build';
import EventGuideIcon from '@mui/icons-material/EventNote';
import TeamIcon from '@mui/icons-material/Group';
import SpatialIcon from '@mui/icons-material/LocationOn';
import TracksIcon from '@mui/icons-material/Map';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import ShowcaseIcon from '@mui/icons-material/ViewCarousel';
import React, { useEffect, useRef, useState } from 'react';



interface AdminOverlayProps {
    onClose: () => void;
}

const AdminOverlay: React.FC<AdminOverlayProps> = ({ onClose }) => {

    const FLAGS = ["Schedule", "Team", "Hardware", "Showcase", "Spatial", "Tracks", "Tools", "Settings", "Event Guide", " Report a problem"]
    // eslint-disable-next-line react/jsx-key
    const icons = [<ScheduleIcon />, <TeamIcon />, <HardwareIcon />, <ShowcaseIcon />, <SpatialIcon />, <TracksIcon />, <ToolsIcon />, <SettingsIcon />, <EventGuideIcon />, <ReportProblemIcon />]
    const [flagStates, setFlagStates] = useState([true, true, true, true, true, false, false, false, false, false])
    const toggleBox = (index: number): void => {
        const updatedFlagStates: boolean[] = [...flagStates];
        updatedFlagStates[index] = !updatedFlagStates[index];
        setFlagStates(updatedFlagStates);
    };
    // check if the user clicked out of the overlay
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const checkClickOutOfBox = () => {
        const handleDocumentClick = (event: MouseEvent) => {
            // Check if the click is outside of the overlay
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        // Add a click event listener to the document
        document.addEventListener('click', handleDocumentClick);

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('click', handleDocumentClick);
        };
    };

    useEffect(() => {
        return checkClickOutOfBox();

    }, []);

    return (
        <div ref={overlayRef} className='flex flex-col w-full h-full mb-2 rounded-lg border border-1 border-gray-200 overflow-y-auto pb-2'>
            <div className='ml-2 my-2 font-bold'>Features</div>
            <div className='flex flex-col h-parent mb-2'>
                {FLAGS.map((label, index) => (
                    <FeatureFlagComponent
                        key={label}
                        label={label}
                        active={flagStates[index]}
                        icon={icons[index]}
                        onToggle={() => toggleBox(index)}
                    />))}
            </div>
            <div className="w-full mt-auto p-2 rounded-lg border border-1 border-gray-200 hover:bg-gray-700 hover:text-white hover:cursor-pointer text-center shadow-lg my-1" onClick={onClose}>Close</div>

        </div>
    );
};


export default AdminOverlay;

interface FeatureFlagComponentProps {
    label: string;
    active: boolean;
    icon: React.ReactNode;
    onToggle: Function;
}


function FeatureFlagComponent({ label, active, icon, onToggle }: FeatureFlagComponentProps) {
    const toggleBox = () => {
        onToggle();
    };

    return (
        <div className='flex flex-row p-2 border-x-0 border-y-2 border-gray-200'>
            <div className='flex flex-row gap-2 items-center'>
                <TogglingBox isActive={active} />
                {icon}
                <div>{label}</div>
            </div>
            <button className='px-2 rounded-lg ml-auto border border-1 border-gray-200 hover:bg-gray-700 hover:cursor-pointer hover:text-white' onClick={toggleBox}>
                {active ? "disable" : "enable"}
            </button>
        </div>
    );
}

interface TogglingBoxProps {
    isActive: boolean;
}

const TogglingBox: React.FC<TogglingBoxProps> = ({ isActive }) => {
    return (
        <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
        >
            {isActive ? (
                <div className="text-white">✔</div>
            ) : (
                <div className="text-white">✕</div>
            )}
        </div>
    );
}

