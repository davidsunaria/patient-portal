import React, { useState } from "react";

const Tabs = (props) => {
    return (
        <ul className="customTabs">
            {props.tabsData &&
                props.tabsData.map((obj, idx) => {
                    return (
                        <li key={idx}>
                            <a
                                className={
                                    props.selectedTab == obj.handler
                                        ? "active"
                                        : ""
                                }
                                onClick={() => props.tabsHandler(obj)}
                            >
                                {obj.name}
                            </a>
                        </li>
                    );
                })}
        </ul>
    );
};
export default Tabs;
