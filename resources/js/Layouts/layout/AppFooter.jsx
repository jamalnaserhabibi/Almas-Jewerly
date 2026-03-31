import React, { useContext } from "react";

const AppFooter = () => {
    return (
        <div className="layout-footer">
            {/* <span>Made with <span className="text-red-500">&#10084;&#65039;</span> by</span>
            <span className="font-medium ml-2">zahinsoft</span> */}
            <a
                href="https://zahinsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium ml-2"
            >
                zahinsoft
            </a>
        </div>
    );
};

export default AppFooter;
