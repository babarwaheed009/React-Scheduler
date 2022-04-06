import React, { useState, useCallback, useContext } from "react";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import { MyContext } from "./Schedule";
import moment from 'moment';
function Events({ employee }) {
  const {
    calendar,
    events,
    jobs,
    shifts,
    getEmployeeJobs,
    customerId,
    getEvents,
    setCurrentEmployee,
    setSelectedDate,
    setType,
    setCurrentWeekNumber,
    setSelectedEvent,
    setEvents,
  } = useContext(MyContext);
  const [disableMode, setDisableMode] = useState(false);

  const addNew = (employee, date) => {
    getEmployeeJobs(customerId, employee.employee_id);
    setCurrentEmployee(employee);
    setSelectedDate(date);
    setType("add");
    $("#sideModal").modal("show");
    setSelectedEvent({ id: "" });
    setCurrentWeekNumber(weekNumber(date));
    // stoploader();
  };

  const edit = (_type, _event, _date) => {
    // startloader();
    $("#sideModal").modal("show");
    getEmployeeJobs(customerId, _event.employee_id);
    setSelectedEvent(_event);
    setType(_type);
    setSelectedDate(_date);
    setCurrentWeekNumber(weekNumber(_date));
    // stoploader();
  };

  const delEvent = useCallback((id, date) => {
    let data = {
      id: id,
      type: "delete",
    };
    //startloader();
    let check = window.confirm("Are You Sure?");
    if (check) {
      axios.post("/api/postEmployeeSchedule", data).then((response) => {
        getEvents(date);
        stoploader();
      });
    }
  }, []);

  const getValueById = (array, array_value, id, value) => {
    let val;
    array.map((v) => {
      if (v[array_value] == id) {
        val = v[value];
      }
    });
    return val;
  };

  const dragDrop = useCallback(
    (id, previousDate, date, e) => {
      console.log("Drop Call");
      //startloader();
      var data = { id: id, date: date, type: "date_update" };
      let newArray = [...events];
      let obj = newArray[e.dragData.index].repeat_days;
      if (obj) {
        obj[obj.findIndex((el) => el === previousDate)] = date;
      }

      newArray[e.dragData.index] = {
        ...newArray[e.dragData.index],
        schedule_date: date,
      };
      console.log(newArray);
      setEvents(newArray);
      axios.post("/api/postEmployeeSchedule", data).then((response) => {
        console.log(response);
        getEvents(date);
      });
    },
    [events]
  );

  const weekNumber = (date) => {
    var weekNumber = moment(date).startOf("isoWeek");

    if (
      moment(date)
        .startOf("month")
        .isSame(weekNumber, "week")
    ) {
      weekNumber = moment(date);
    }
    var day = weekNumber.format("dddd");
    weekNumber = weekNumber.date() / 7;
    if (day == "Monday" && !isFloat(weekNumber)) {
      weekNumber = Math.ceil(weekNumber) + 1;
    } else {
      weekNumber = Math.ceil(weekNumber);
    }
    if (weekNumber == 0 || weekNumber == 1) {
      weekNumber = "First";
    } else if (weekNumber == 2) {
      weekNumber = "Second";
    } else if (weekNumber == 3) {
      weekNumber = "Third";
    } else if (weekNumber == 4 || weekNumber == 5) {
      weekNumber = "Fourth";
    }
    return weekNumber;
  };

  const isFloat = useCallback((n) => {
    return Number(n) === n && n % 1 !== 0;
  }, []);
  return (
    <React.Fragment>
      {calendar.map((c, ci) => {
        let assignment_data = "";
        return (
          <td className="td-assignment border-right border-bottom" key={ci}>
            {events.map((event, i) => {
              let calendarDate = moment(new Date(c.fullDate)).format(
                "YYYY-MM-DD"
              );
              let eventDate = moment(new Date(event.schedule_date)).format(
                "YYYY-MM-DD"
              );
              let dateCondition = "";
              if (
                event.repeat_till &&
                event.repeat_till != "0000-00-00" &&
                event.repeat_days
              ) {
                dateCondition =
                  calendarDate >= eventDate &&
                  calendarDate <= event.repeat_till &&
                  event.repeat_days.indexOf(calendarDate) > -1;
              } else {
                dateCondition = calendarDate == eventDate;
              }

              if (event.employee_id == employee.employee_id && dateCondition) {
                assignment_data = "event";
                return (
                  <div className="event-container position-relative" key={i}>
                    <DragDropContainer
                      targetKey="boxItem"
                      dragData={{ ...event, index: i }}
                      xOnly={true}
                      onDrag={(e) => {
                        // setDisableMode(true);
                        $(".multiple-events").css("width", "150px");
                      }}
                      onDragEnd={() => {
                        // setDisableMode(false);
                        // $(this).css('width' , '100%')
                        $(".multiple-events").css("width", "100%");
                      }}
                      // dragClone={true}
                      // disappearDraggedElement={false}
                    >
                      <DropTarget
                        onHit={(e) => console.log("on Hit")}
                        targetKey="boxItem"
                      >
                        <div
                          className="job-assignment px-1 pt-2 mb-2 text-white rounded"
                          style={{ backgroundColor: event.color }}
                        >
                          <h6 className="mb-1 fw-bold text-light">
                            {getValueById(
                              jobs,
                              "employee_job_id",
                              event.employee_job_id,
                              "name"
                            )}
                          </h6>
                          <div className="d-flex justify-content-between">
                            <span className="text-capitalize">
                              <i
                                className={`fas ${
                                  getValueById(
                                    shifts,
                                    "id",
                                    event.shift_id,
                                    "name"
                                  ) == "Morning" ||
                                  getValueById(
                                    shifts,
                                    "id",
                                    event.shift_id,
                                    "name"
                                  ) == "Evening"
                                    ? "fa-sun text-warning"
                                    : "fa-moon"
                                }`}
                              ></i>{" "}
                              {getValueById(
                                shifts,
                                "id",
                                event.shift_id,
                                "name"
                              )}
                            </span>
                            <p className="m-0 text-right event-actions">
                              <i
                                className="fas fa-plus-square"
                                onClick={() => addNew(employee, c.fullDate)}
                              ></i>
                              <i
                                className="fas fa-edit edit"
                                onClick={() =>
                                  edit("update", event, c.fullDate)
                                }
                              ></i>
                              <i
                                className="fas fa-trash delete"
                                onClick={() => delEvent(event.id, c.fullDate)}
                              ></i>
                            </p>
                          </div>
                        </div>
                      </DropTarget>
                    </DragDropContainer>
                  </div>
                );
              } else if (assignment_data == "") {
                assignment_data = "Add New Button";
              }
            })}

            {(assignment_data == "Add New Button" || events.length == 0) && (
              <div className="position-relative">
                <div
                  className={`drop-target-container position-absolute w-100 h-100`}
                  style={{ zIndex: disableMode ? "1000" : "-1" }}
                >
                  <DropTarget
                    onHit={(e) =>
                      dragDrop(
                        e.dragData.id,
                        e.dragData.schedule_date,
                        c.fullDate,
                        e
                      )
                    }
                    targetKey="boxItem"
                  >
                    <div className="outer">
                      <div className="item w-100 h-100 text-light"></div>
                    </div>
                  </DropTarget>
                </div>
                <div className="empty-event text-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => addNew(employee, c.fullDate)}
                  >
                    <i className="fas fa-plus-square pr-3"></i> Add
                  </button>
                </div>
              </div>
            )}
          </td>
        );
      })}
    </React.Fragment>
  );
}

export default React.memo(Events);
