import React, { useState } from "react";
import { numberFormat } from "patient-portal-utils/Service";

const Table = (props) => {
    return (
        <div className="table-responsive mb-4">
            <table className="table mb-0 table-striped">
                <thead>
                    <tr key={1}>
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
                                <td>{numberFormat(val?.rate, 'currency', 2, 2)}</td>
                                <td>{numberFormat(val?.tax, 'currency', 2, 2)}</td>
                                <td>{numberFormat(val?.amount, 'currency', 2, 2)}</td>
                            </tr>
                        ))

                    ) : (
                        <tr>
                            <td colSpan={5}>
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
