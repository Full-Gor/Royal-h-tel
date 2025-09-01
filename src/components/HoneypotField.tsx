import React, { useState, useEffect } from 'react';

interface HoneypotFieldProps {
    name: string;
    className?: string;
}

const HoneypotField: React.FC<HoneypotFieldProps> = ({ name, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Rendre le champ invisible après un court délai
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (isVisible) return null;

    return (
        <div
            className={`absolute left-[-9999px] ${className}`}
            aria-hidden="true"
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none'
            }}
        >
            <input
                type="text"
                name={name}
                autoComplete="off"
                tabIndex={-1}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default HoneypotField;
