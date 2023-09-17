import React, { ReactNode } from 'react';

type BlurProps = {
    children: ReactNode;
    bool?: boolean;
}

const Blur: React.FC<BlurProps> = ({ children, bool = true }) => {
    const blurStyle = {
        filter: bool ? 'blur(15px)' : 'none',
        display: 'inline-block',
        width: '100%',
        height: '100%',
    };

    return <div style={blurStyle}>{children}</div>;
};

export default Blur;
