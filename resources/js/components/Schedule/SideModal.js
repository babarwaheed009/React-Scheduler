
import React,{useState,useEffect} from 'react'
import moment from 'moment';
import axios from 'axios';
// import 'mdbreact/dist/css/mdb.css';
// import 'bootstrap-css-only/css/bootstrap.min.css'; 
function SideModal() {
    // const [_jobs , _setJobs] = useState({});
    // const [_shifts , _setShifts] = useState({});

    // const repeatOptions = [
    //     { value: 'monthly', label: 'Monthly' },
    //     { value: 'weekly', label: 'Weekly' },
    //     { value: 'daily', label: 'Daily' },
    //     { value: 'every_weekday', label: 'Every Weekday' }
    // ]
    
    // const [assignmentDetail, setAssignmentDetail] = useState({
    //     shift_id:'',
    //     color:'',
    //     shift_notes:'',
    //     time_from:'',
    //     time_to:'',
    //     schedule_date : '',
    //     allDay:false,
    //     repeat:false,
    //     repeat_type:'',
    //     repeat_on:[],
    //     repeat_frequency:0,
    //     repeat_till:null

    // });
    // const [selectColor,setSelectColor] = useState(null);
    // const [displayColorPicker, setDisplayColorPicker] = useState(false);
    // const [disableMode , setDisabledMode] = useState(true);

    // useEffect(() => {
    //     let run = true;
    //     if(run && event.id){
    //         event = {
    //             ...event ,
    //             //  schedule_date : moment(event.schedule_date).format('YYYY-MM-DD'),
    //             repeat : event.repeat_till?true: false,
    //             //  repeat_on : event.repeat_type == 'weekly' ? repeatDays : ''
    //             }
    //         setAssignmentDetail(event)
    //         setSelectColor(event.color)
    //         setDisabledMode(false)
    //     }else{
    //         addNew();
    //         setDisabledMode(true)
    //     }
    //     return () => {
    //         // cancel the subscription
    //         run = false;
    //     };
    // }, [event])

    // useEffect(() => {
    //     let run = true;
    //     if(run && jobs.length > 0){
    //         let option = jobs.map((value) => {
    //         return { value: value.employee_job_id, label: value.name };
    //     });
    //     _setJobs(option);
    //     }else{
    //         _setJobs([]);
    //     }
    //     return () => {
    //         // cancel the subscription
    //         run = false;
    //     };
    // }, [jobs])


    // useEffect(()=>{
    //     let run = true;
    //     if(run && shifts.length > 0){
    //         let option = shifts.map((v)=>{
    //             return {label : v.name , value : v.id}
    //         });
    //         _setShifts(option)
    //     }
    //     return () => {
    //         // cancel the subscription
    //         run = false;
    //     };
    // },[shifts])

    // function handleChange(evt){
    //     let name = evt.target.name;
    //     let value = evt.target.value;
    //     if(evt.target.name == 'repeat_on'){
    //         if(evt.target.type == 'checkbox'){
    //             let checkbox = $(".repeat_on");
    //             let array = [];
    //             checkbox.map((i,v)=>{
    //                 if(v.checked){
    //                     array.push(v.value)
    //                 }
    //             })
    //             value = array
    //         }  
    //     }
    //     if(evt.target.type == 'checkbox' && evt.target.name != 'repeat_on'){
    //         value = evt.target.checked;
    //     }

        
    //     let newObject= {...assignmentDetail , [name]:value};
    //     if(name == 'allDay'){
    //         newObject = {...newObject , time_from:null , time_to: null , shift_id:null}
    //     }
    //     setAssignmentDetail(newObject);
    //     let check = validation(newObject);
    //     console.log(check);
    //     if(check){
    //         setDisabledMode(false);
    //     }else{
    //         setDisabledMode(true);
    //     }
    // }

    // function validation(object){
    //     let valid = false;
    //     console.log($('.repeat_on'));
    //     for (const key in object) {
    //         if(object.repeat){
    //             if((object[key] == '' || !object[key]) && key !='allDay'){
    //                 valid = false;
    //                 break;
    //             }else{
    //                 valid = true;
    //             }
    //         }else{
    //             if(!key.includes('repeat') && key !='allDay'){
    //                 if(object[key] == '' || !object[key]){
    //                     valid = false;
    //                     break;
    //                 }else{
    //                     valid = true;
    //                 }
    //             }
    //         }
            
    //     }
    //     return valid;
    // }
    // const addNew = ()=>{
    //     setAssignmentDetail({
    //         shift_id:'',
    //         color:'',
    //         shift_notes:'',
    //         time_from:'',
    //         time_to:'',
    //         schedule_date:'',
    //         allDay:false,
    //         repeat:false,
    //         repeat_type:'',
    //         repeat_on:[],
    //         repeat_frequency:0,
    //         repeat_till:''
    //     })
    //     setSelectColor('');
    //     setDisplayColorPicker(false)
    // }
    // const onSave=()=>{
    //     // console.log(employee);
    //     startloader();
    //     var data = {
    //         ...assignmentDetail,
    //         employee_id:employee.employee_id,
    //         job_id:employee.job_id,
    //         type : type
    //     };
    //     console.log(data)
    //     axios.post('/api/postEmployeeSchedule' , data).then((response)=>{
    //         console.log(response)
    //         getEvents(date)
    //         $("#sideModal").modal('hide')
    //         addNew();
    //         stoploader();
    //     })
    // }

    // const handleColorChange = (color)=>{
    //     setAssignmentDetail(prevState=>({
    //         ...prevState,
    //         color:color.hex
    //     }))
    //     setSelectColor(color.hex);
    //     // setDisplayColorPicker(false)
    // }

    // const selectHandleChange = (item , action)=>{

    //     // console.log(item , action)
    //     let name = action.name;
    //     let value = item ? item.value : '';
    //     let newObject = {};
    //     if(name == 'shift_id'){
    //         newObject = {
    //             ...assignmentDetail,
    //             [name]:value,
    //             time_from : getValueById(shifts, 'id', value , 'time_from'),
    //             time_to : getValueById(shifts, 'id', value , 'time_to')
    //         }
    //     }else if(name == 'repeat_type'){
    //         newObject = {
    //             ...assignmentDetail,
    //             [name]:value,
    //             repeat_on:[]
    //         }
    //     }else{
    //         newObject = {
    //             ...assignmentDetail,
    //             [name]:value
    //         }
    //     }
    //     setAssignmentDetail(newObject);
    //     let check = validation(newObject);
    //     console.log(check);
    //     if(check){
    //         setDisabledMode(false);
    //     }else{
    //         setDisabledMode(true);
    //     }
        
    // }

    // const getValueById = (array,array_value,id,value)=>{
    //     let val;
    //     array.map((v)=>{
    //       if(v[array_value] == id){
    //         val =v[value];
    //       }
    //     })
    //     console.log(val);
    //     return val;
    //   }

    // useEffect(() => {
    //    console.log(assignmentDetail)
    // }, [assignmentDetail])

    // useEffect(() => {
    //     let weekDays = $('.repeat_on');
    //     let run = true;
    //     if(run && weekDays.length > 0){
    //         if(assignmentDetail.repeat_on && assignmentDetail.repeat_on.length > 0){
    //             weekDays.map((a,v)=>{
    //                 if(assignmentDetail.repeat_on.indexOf(v.value) > -1){
    //                     v.checked=true;
    //                 }else{
    //                     v.checked=false;
    //                 }
    //             })
    //         }
            
    //     }
    //     return () => {
    //         // cancel the subscription
    //         run = false;
    //     };
    // }, [$('.repeat_on')])

    return (
        <>
            <div className="modal right fade" id="sideModal" aria-labelledby="sideModalLabel" aria-hidden="true" data-mdb-backdrop="true" data-mdb-keyboard="true">
                <div className="modal-dialog modal-full-height modal-side modal-top-right ">
                    <div className="modal-content">
                        <div className="modal-body position-relative">
                            <div className="row">
                                <div className="col-12">
                                    {/* <input type="hidden" value={assignmentDetail.schedule_date = date?date:''} /> */}
                                    <p><span className="fas fa-calendar color-pink"></span> {moment(new Date()).format('dddd, MMMM D, YYYY')}</p>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="checkbox" name="allDay" id="allDay"/>
                                        <label className="form-label color-pink" htmlFor="allDay"  className="ml-2">All Day</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Assignments</label>
                                        <input type="text" className="form-control" />
                                        {/* <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            isSearchable={true}
                                            name="employee_job_id"
                                            value={_jobs.length > 0 ?_jobs.filter(({value}) => value === parseInt(assignmentDetail.employee_job_id)) : ''}
                                            options={_jobs}
                                            onChange={selectHandleChange}
                                            placeholder="Select Assignment"
                                        /> */}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Shift</label>
                                        <select className="form-control">
                                            <option value="">Morning</option>
                                            <option value="">Evening</option>
                                            <option value="">Night</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`col-6 col-12`}>
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Color</label>
                                        <button className="btn btn-warning form-control position-relative m-0 h-auto">Select Color</button>
                                        <div className="popup position-absolute" style={{zIndex:'1'}}>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Time From</label>
                                        <input type="time" name="time_from" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Time To</label>
                                        <input type="time" name="time_to" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label color-pink" >Notes</label>
                                        <textarea name="shift_notes" className="form-control" id="shift_notes"></textarea>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="checkbox" name="repeat" id="repeat" />
                                        <label className="form-label" htmlFor="repeat" className="ml-2">Repeat</label>
                                    </div>
                                </div>
                                {/* {assignmentDetail.repeat &&  */}
                                
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default React.memo(SideModal)
