import React, { useState } from "react";

const Table = (props) => {
    return (
        <div className="table-responsive">
            <table className="table mb-0 table-striped">
                <thead>
                    <tr>
                        {props.headers &&
                            props.headers.map((obj, idx) => {
                                return <th>{obj}</th>;
                            })}
                    </tr>
                </thead>
                <tbody>
                    {props.tableData && props.tableData.length > 0 ? (
                        props.tableData.map((val, index) => (
                            <tr key={index}>
                                <td>
                                   {val?.product_name}
                                </td>
                                <td>{val?.quantity}</td>
                                <td>INR {val?.rate}</td>
                                <td>{val?.tax}</td>
                                <td>INR {val?.amount}</td>
                            </tr>
                        ))

                    ) : (
                        <tr colSpan={5}>
                            <td>
                                No data found
                            </td>

                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default Table;
