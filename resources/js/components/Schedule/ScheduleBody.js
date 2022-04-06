import React, { useState, useCallback } from "react";
import Events from "./Events";
function ScheduleBody({
  employees,
}) {

  
  return (
    <React.Fragment>
      <tbody style={{ height: "500px", overflow: "hidden" }}>
        {employees &&
          employees.map((employee, index) => {
            return (
              <tr key={index}>
                <td className="border-right employee_list">
                  <div>
                    <h4>{employee.employee_name}</h4>
                    <p>00.00 hrs | $00.00</p>
                  </div>
                </td>
                <Events employee={employee} />
              </tr>
            );
          })}
      </tbody>
    </React.Fragment>
  );
}

export default React.memo(ScheduleBody);
