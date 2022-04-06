import React, {useState, useEffect } from 'react';
import Select from "react-select";
function Customers({getEmployees,customers}) {
    console.log("customers");
    
  return <React.Fragment>
            <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="customers"
                    options={customers}
                    onChange={getEmployees}
                    placeholder="Select Customers"
                />
  </React.Fragment>;
}

export default React.memo(Customers);
