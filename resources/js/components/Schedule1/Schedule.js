import React,{useState,useEffect,useCallback} from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios'
import moment from 'moment';
import './MainApp.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import SideModal from './SideModal';
import $ from 'jquery';
function Schedule() {
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(null);
    const [week, setWeek] = useState(0);
    const [disableMode, setDisableMode] = useState(false);

    const weekDays = (date) => {
        var weekStart = moment(date).startOf("isoWeek");
        var week = [];
        for (var i = 0; i <= 6; i++) {
          let date = moment(weekStart).add(i, "days");
          var formatedDate = date.format("YYYY-MM-DD");
          var dayName = date.format("dddd");
          var _date = date.format("DD");
          week.push({
            dayName: dayName,
            date: _date,
            fullDate: formatedDate,
          });
        }
        return week;
      };

      function currentWeekView(date) {
        var weekStartDate = moment(date).startOf("isoWeek");
        var weekLastDate = moment(date).endOf("isoWeek");
    
        var com =
          weekStartDate.format("MMMM DD, YYYY") +
          " - " +
          weekLastDate.format("MMMM DD, YYYY");
        setCurrentWeek(com);
      }

      function changeWeek(_week) {
        var nextDate = moment()
          .add(_week, "weeks")
          .startOf("isoWeek");
        currentWeekView(nextDate);
        setCalendar(weekDays(new Date(nextDate)));
      }

    useEffect(() => {
        let run =true;
        if(run){
            axios.get('/api/customers')
            .then((response)=>{
            console.log(response);
            setCustomers(response.data);
        });
        getEmployees();
        setCalendar(weekDays(new Date()));
        currentWeekView(new Date());
        }
        return ()=>{
            run = false;
        }
    }, [])
    
    const getEmployees=useCallback((id)=>{
        console.log("Employees")
        axios.post(`/api/employees/${id??''}`)
        .then((response)=>{
            console.log(response);
            setEmployees(response.data);
        })
    },[employees])

    const addNew = () => {
        console.log($('#sideModal'));
        // $("#sideModal").modal("show");
        // stoploader();
      };
    
    return (
        <>
            <div className="container-fluid mt-5">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
  Launch static backdrop modal
</button>

<div className="modal fade" id="staticBackdrop" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div>
                {/* <select onChange={(evt)=>getEmployees(evt.target.value)}>
                <option value="">All</option>
                    {customers.map((customer,index)=>{
                        return (
                            <option value={customer.id} key={index}>{index} {customer.first_name,customer.last_name}</option>
                        )
                    })}
                </select>

                    {employees.map((emp,index)=>{
                        return (
                            <p key={index}>{emp.id} {emp.first_name,emp.last_name}</p>
                        )
                    })} */}
                    <div className="row">
                        <div className="col-sm-2">
                        <select onChange={(evt)=>getEmployees(evt.target.value)} className="form-control">
                            <option value="">All</option>
                                {customers.map((customer,index)=>{
                                    return (
                                        <option value={customer.id} key={index}>{index} {customer.company_name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="current-week-container col-sm-6 offset-3">
                            <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                let _week = week - 1;
                                changeWeek(_week);
                                setWeek(_week);
                            }}
                            >
                            <span className="fas fa-chevron-left"></span>
                            </button>
                            <span className="fw-bold">{currentWeek}</span>
                            <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                let _week = week + 1;
                                changeWeek(_week);
                                setWeek(_week);
                            }}
                            >
                            <span className="fas fa-chevron-right"></span>
                            </button>
                        </div>
                        <div className="col-sm-12 table-container">
                            <table className="table mt-3">
                            <thead className="bg-light">
                                <tr>
                                <td className="border-right employee_list">
                                    <select className="form-control">
                                    <option value="">View By - Employee</option>
                                    <option value="">Employee</option>
                                    </select>
                                </td>
                                {calendar.map((value, index) => {
                                    return (
                                    <td
                                        className="td-assignment border-right border-bottom"
                                        key={index}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                        <p className="m-0">{value.dayName}</p>
                                        <h2 className="m-0 text-primary">{value.date}</h2>
                                        </div>
                                    </td>
                                    );
                                })}
                                </tr>
                            </thead>
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
                                        {calendar.map((cal,i)=>{
                                            return (
                                                <td key={i} className="border-right job-assignment">
                                                    <button className="btn btn-outline-primary empty-event" type="button">Add New</button>
                                                    {/* <div className="position-relative event-actions">
                                                        <div
                                                        className={`position-absolute w-100 h-100`}
                                                        style={{ zIndex: disableMode ? "1000" : "-1" }}
                                                        >
                                                        </div>
                                                        <div className="empty-event text-center">
                                                        {/* <button
                                                            className="btn btn-outline-primary"
                                                            onClick={addNew}
                                                            // onClick={() => addNew(employee, c.fullDate)}
                                                        >
                                                            <i className="fas fa-plus-square pr-3"></i> Add
                                                        </button> 
                                                        </div>
                                                    </div> */}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    );
                                })}
                            </tbody>
                            </table>
                        </div>
                    </div>

            </div>
            <SideModal />
        </>
         )
}

export default Schedule

if (document.getElementById('root')) {
    ReactDOM.render(<Schedule />, document.getElementById('root'));
}