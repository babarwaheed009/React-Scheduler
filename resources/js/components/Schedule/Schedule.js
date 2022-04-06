import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import "./Schedule.css";
import moment from './moment';
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import SideModal from './SideModal';
import Customers from "./Customers";
import ScheduleBody from "./ScheduleBody";
export const MyContext = React.createContext();

function TableSchedule() {
  let url = "/api";
  const [calendar, setCalendar] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [week, setWeek] = useState(0);
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [employeeJobs, setEmployeeJobs] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [type, setType] = useState(null);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState({ id: "" });
  // Get WeekDays from monday to Sunday

  const weekDays = (date) => {
    var weekStart = moment(date).startOf("isoWeek");
    var week = [];
    for (var i = 0; i <= 6; i++) {
      var date = moment(weekStart).add(i, "days");
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

  // Get Current Week

  function currentWeekView(date) {
    var weekStartDate = moment(date).startOf("isoWeek");
    var weekLastDate = moment(date).endOf("isoWeek");

    var com =
      weekStartDate.format("MMMM DD, YYYY") +
      " - " +
      weekLastDate.format("MMMM DD, YYYY");
    setCurrentWeek(com);
  }

  // // Change Next or Prev Week

  function changeWeek(_week) {
    var nextDate = moment()
      .add(_week, "weeks")
      .startOf("isoWeek");
    currentWeekView(nextDate);
    setCalendar(weekDays(new Date(nextDate)));
  }

  // get Customers

  const getCustomers = useCallback(() => {
    //startloader();
    axios.get(url + "/customers").then((response) => {
      let option = response.data.map((value) => {
        return { value: value.id, label: value.company_name };
      });
      setCustomers(option);
      //stoploader();
    });
  }, [customers]);

  // Get Employees

  const getEmployees = useCallback(
    (evt) => {
      //startloader();
      if (evt) {
        setCustomerId(evt.value);
      } else {
        setCustomerId(null);
      }
      axios
        .post(url + "/employees", { customer_id: evt ? evt.value : null })
        .then((response) => {
          console.log(response.data);
          setEmployees(response.data);
          // setJobs(response.data.jobs);
          //stoploader();
        });
      getEvents(new Date());
    },
    [employees]
  );

  // get Events

  const getEvents = useCallback(
    (date) => {
      var weekStartDate = moment(date).startOf("isoWeek");
      var weekLastDate = moment(date).endOf("isoWeek");
      //startloader();
      axios
        .post(url + "/employeeAssignment", {
          start_date: weekStartDate,
          end_date: weekLastDate,
        })
        .then((response) => {
          let _events = response.data.assignments;
          let _shifts = response.data.shifts;
          let dateArray = [];
          let temp = [];
          _events.map((v) => {
            let dateArray = [];
            if (v.repeat_on && v.repeat_type == "weekly") {
              v.repeat_on = v.repeat_on.split(";");

              v.repeat_days = v.repeat_on.map((day) => {
                return moment(v.schedule_date)
                  .day(day)
                  .format("YYYY-MM-DD");
              });

              v.repeat_days = v.repeat_days.map((date) => {
                if (date < v.schedule_date) {
                  return moment(date)
                    .add(parseInt(v.repeat_frequency) + 1, "W")
                    .format("YYYY-MM-DD");
                } else {
                  return date;
                }
              });

              let _date = v.schedule_date;
              let every = 0;
              for (var i = 0; _date <= v.repeat_till; i++) {
                v.repeat_days = v.repeat_days.map((date) => {
                  if (i == 0) {
                    dateArray.push(date);
                    temp.push(date);
                  } else {
                    _date = moment(date)
                      .add(1, "weeks")
                      .format("YYYY-MM-DD");

                    if (_date <= v.repeat_till && v.repeat_frequency == every) {
                      dateArray.push(_date);
                      temp.push(_date);
                    } else if (_date <= v.repeat_till) {
                      temp.push(_date);
                    }
                  }
                });
                if (i != 0 && every < v.repeat_frequency) {
                  every++;
                } else if (every == v.repeat_frequency) {
                  every = 0;
                }
                v.repeat_days = temp;
                temp = [];
              }

              v.repeat_days = dateArray.sort();
            } else if (v.repeat_on && v.repeat_type == "monthly") {
              let _date = v.schedule_date;
              let every = 0;
              if (v.repeat_on == "by_month") {
                dateArray.push(v.schedule_date);

                for (var i = 0; _date <= v.repeat_till; i++) {
                  _date = moment(_date)
                    .add(1, "months")
                    .format("YYYY-MM-DD");
                  if (_date <= v.repeat_till && v.repeat_frequency == every) {
                    dateArray.push(_date);
                    every = 0;
                  } else {
                    every++;
                  }
                  // dd($currentDateTemp <= $repeat_till);
                }
                v.repeat_days = dateArray.sort();
              } else {
                let day = moment(v.schedule_date).format("dddd");
                dateArray.push(v.schedule_date);
                for (var i = 0; _date <= v.repeat_till; i++) {
                  _date = moment(_date)
                    .add(1, "months")
                    .day(day)
                    .format("YYYY-MM-DD");
                  if (_date <= v.repeat_till && v.repeat_frequency == every) {
                    dateArray.push(_date);
                    every = 0;
                  } else {
                    every++;
                  }
                  // dd($currentDateTemp <= $repeat_till);
                }
                v.repeat_days = dateArray.sort();
              }
            } else if (v.repeat_type == "daily") {
              let _date = v.schedule_date;
              dateArray.push(v.schedule_date);
              let every = 0;
              for (var i = 0; _date < v.repeat_till; i++) {
                _date = moment(_date)
                  .add(1, "days")
                  .format("YYYY-MM-DD");
                if (_date <= v.repeat_till && v.repeat_frequency == every) {
                  dateArray.push(_date);
                  every = 0;
                } else {
                  every++;
                }
              }
              v.repeat_days = dateArray.sort();
            } else if (v.repeat_type == "every_weekday") {
              let weekDays = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ];
              v.repeat_days = weekDays.map((day) => {
                return moment(v.schedule_date)
                  .day(day)
                  .format("YYYY-MM-DD");
              });

              v.repeat_days = v.repeat_days.map((date) => {
                if (date < v.schedule_date) {
                  return moment(date)
                    .add(parseInt(v.repeat_frequency) + 1, "W")
                    .format("YYYY-MM-DD");
                } else {
                  return date;
                }
              });

              let _date = v.schedule_date;
              let every = 0;
              for (var i = 0; _date <= v.repeat_till; i++) {
                v.repeat_days = v.repeat_days.map((date) => {
                  if (i == 0) {
                    dateArray.push(date);
                    temp.push(date);
                  } else {
                    _date = moment(date)
                      .add(1, "weeks")
                      .format("YYYY-MM-DD");

                    if (_date <= v.repeat_till && v.repeat_frequency == every) {
                      dateArray.push(_date);
                      temp.push(_date);
                    } else if (_date <= v.repeat_till) {
                      temp.push(_date);
                    }
                  }
                });
                if (i != 0 && every < v.repeat_frequency) {
                  every++;
                } else if (every == v.repeat_frequency) {
                  every = 0;
                }
                v.repeat_days = temp;
                temp = [];
              }

              v.repeat_days = dateArray.sort();
            }
          });
          console.log(_events);
          setEvents(_events);
          setShifts(_shifts);
          //stoploader();
        });
    },
    [events]
  );

  function getJobs() {
    axios.get(url + "/jobs").then((response) => {
      setJobs(response.data);
    });
  }

  const getEmployeeJobs = useCallback(
    (customer_id, employee_id) => {
      //startloader();
      let data = {
        customer_id: customer_id,
        employee_id: employee_id,
      };
      axios.post(url + "/employeeJobs", data).then((response) => {
        setEmployeeJobs(response.data);
        //stoploader();
      });
    },
    [employeeJobs]
  );

  useMemo(() => {
    let run = true;
    if (run) {
      setCalendar(weekDays(new Date()));
      currentWeekView(new Date());
      getCustomers();
      getEmployees();
      getJobs();
    }
    return () => {
      run = false;
    };
  }, []);

  function setClasses() {
    var testContainer = document.querySelectorAll(".td-assignment");
    if (testContainer.length > 7) {
      testContainer.forEach((v, a) => {
        var eventContainer = v.querySelectorAll(".event-container");
        var event = v.querySelectorAll(".job-assignment");
        if (eventContainer.length > 1) {
          eventContainer.forEach((e) => {
            e.classList.add("multiple-containers");
          });
          event.forEach((e) => {
            e.classList.add("multiple-events");
          });
        } else {
          eventContainer.forEach((e) => {
            e.classList.remove("multiple-containers");
          });
          event.forEach((e) => {
            e.classList.remove("multiple-events");
          });
        }
      });
    }
  }

  useEffect(() => {
    setClasses();
  });

  return (
    <React.Fragment>
      <div className="container-fluid pt-5 schedule">
        <div className="row">
          <div className="col-2">
            <Customers getEmployees={getEmployees} customers={customers} />
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
              <MyContext.Provider value={{calendar , events , jobs , shifts , getEmployeeJobs , customerId , getEvents , employeeJobs,setCurrentEmployee,setSelectedDate,setType,setCurrentWeekNumber,setSelectedEvent,setEvents}}>
                
              <ScheduleBody
                employees={employees}
              />
              </MyContext.Provider>
            </table>
          </div>
        </div>
      </div>
      <SideModal employee={currentEmployee} event={selectedEvent}  date={selectedDate} weekNumber={currentWeekNumber} getEvents={getEvents} type={type} jobs={employeeJobs} shifts={shifts} />
    </React.Fragment>
  );
}

export default TableSchedule;

if (document.getElementById("root")) {
  ReactDOM.render(<TableSchedule />, document.getElementById("root"));
}
