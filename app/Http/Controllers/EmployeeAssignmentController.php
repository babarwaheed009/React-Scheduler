<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\orders;
use App\Models\Shift;
use App\Models\EmployeeSchedule;
class EmployeeAssignmentController extends Controller
{
    public function index(Request $request){
        $jobs=orders::select('jb.*','ej.id as employee_job_id' , 'ej.employee_id', 'orders.id as job_id','orders.customer_id as customer_id')
        ->join('job_positions as jb','jb.id','=', 'orders.job_position_id')
        ->join('employee_jobs as ej','orders.id','=','ej.job_id')
        ->where('orders.organization_id', 1)
        ->where('ej.employee_id',$request->employee_id)
        ->where('orders.customer_id',$request->customer_id)
        ->where('ej.status','Active')
        ->groupBy('ej.id')->get();

          // return response()->json($jobs);
            $data = DB::table('employee_schedules')
                    // ->where('date' , '>=' , $request->start_date)
                    // ->where('date' , '<=' , $request->end_date)
                    ->get();
            
            $shifts = Shift::all();
            // dd($shifts);
             return response()->json(['assignments' => $data , 'shifts' => $shifts]);
    }

    public function ajax(Request $request)
    {
        // dd($request->all());
      // return response()->json($event);
 
        switch ($request->type) {
           case 'add':
              if($request->repeat_type == 'weekly'){
                $request->repeat_on = implode(';',$request->repeat_on);
              }
              // dd($request->repeat_till !== '' ? $request->repeat_till : null);
              $event = EmployeeSchedule::create([
                'employee_id' => $request->employee_id,
                'employee_job_id' => $request->employee_job_id,
                'time_from' => $request->time_from,
                'time_to' => $request->time_to,
                'schedule_date' => $request->schedule_date,
                'shift_id' => $request->shift_id,
                'color' => $request->color,
                'shift_notes' => $request->shift_notes,
                'repeat_till' => $request->repeat_till !== '' ? $request->repeat_till : null,
                'repeat_type' => $request->repeat_type,
                'repeat_on' => empty($request->repeat_on) ? null : $request->repeat_on,
                'repeat_frequency' => ($request->repeat_frequency ?? 0),
            ])->id;
          // return response()->json(['message' => $event]);
            // if($request->repeat){
            //       $this->repeat($request , $event);
            // }else{
            //   $date = Carbon::parse($request->date)->format('Y-m-d');
            //   ScheduleDates::create([
            //     'schedule_id' => $event,
            //     'date' => $date
            //   ]);
            // }     
          return response()->json(['message' => 'Record Created!']);
          break;
  
           case 'update':
            if($request->repeat_type == 'weekly'){
              $request->repeat_on = implode(';',$request->repeat_on);
            }
            
              $event = EmployeeSchedule::find($request->id)->update([
                // 'title' => $request->title,
                'employee_job_id' => $request->employee_job_id,
                'time_from' => $request->time_from,
                'time_to' => $request->time_to,
                'schedule_date' => $request->schedule_date,
                'shift_id' => $request->shift_id,
                'color' => $request->color,
                'shift_notes' => $request->shift_notes,
                'repeat_till' => $request->repeat_till !== '' ? $request->repeat_till : null,
                'repeat_type' => $request->repeat_type,
                'repeat_on' => empty($request->repeat_on) ? null : $request->repeat_on,
                'repeat_frequency' => ($request->repeat_frequency ?? 0),
              ]);
              // if($request->repeat){
              //   ScheduleDates::where('schedule_id' , $request->id)->delete();
              //   // dd("Repeat");
              //   $this->repeat($request , $request->id);
              // }else{
              //   $date = Carbon::parse($request->date)->format('Y-m-d');
              //   ScheduleDates::updateOrCreate([
              //     'date' => $date
              //   ]);
              // }
              return response()->json($event);
             break;
  
           case 'delete':
            // ScheduleDates::where('event_id' , $request->id)->delete();
              $event = EmployeeSchedule::find($request->id)->delete();
  
              return response()->json($event);
             break;

             case 'date_update':
              // dd([$request->date , $request->id]);
              $event = EmployeeSchedule::where('id' , $request->id)->first();
              $event->schedule_date = $request->date;
              $event->save();
              return response()->json(['message' => 'Date Updated!']);
              // dd($sch_date);
              break;
             
           default:
             # code...
             break;
        }
    }

      public function customers(){
        // $customers = Customer::orderBy('company_name', 'asc')->get();
        $customers = DB::table('customers')->select('*')->get();
        return response()->json($customers);
    }

      public function employees(Request $request , $id = null){
        if($request->customer_id){
          $id = $request->customer_id;
        }
        if($id){
              $jobs=orders::where('organization_id', 1)->where('customer_id', '=', $id)->get()->pluck('id')->toArray();
          }else{
              $jobs=orders::where('organization_id', 1)->get()->pluck('id')->toArray();
          }
          
          $all = DB::table('employee_jobs')->select(DB::raw("employee_jobs.employee_id,j.id as job_id, concat(e.first_name,'  ',e.middle_name,' ',e.last_name) as employee_name"))
          ->join('employees as e','e.id','=','employee_jobs.employee_id')
          ->join('orders as j','j.id','=','employee_jobs.job_id')
          ->whereIn('employee_jobs.job_id', $jobs)
          ->where('j.organization_id', 1)
          ->where('e.hiring_status', '=' ,'Assigned')
          // ->limit(30)
          ->groupBy('employee_id')    
          ->get();


          // $test = EmployeeJobs::with(['Job' => function ($query) {
          //   $query->select('id',)->where('organization_id', 1);
          //   }])
          //   ->whereHas('Employee' , function ($query) {
          //       $query->assigned();
          //   })
          //   ->with(['Employee' => function($query) {
          //         $query->select(DB::raw("id, CONCAT(first_name,' ',last_name) AS name"));
          //    }])
          //   ->whereIn('job_id', $jobs)
          //   ->groupBy('employee_id')
          //   // ->limit(30)
          //   ->get();
        // dd($test);
          return response()->json($all);
      }

      public function employeeJobs(Request $request){
        // dd($request->customer_id,$request->employee_id);
        if($request->customer_id){
          $employee_jobs=DB::table('orders')->select('jb.*','ej.id as employee_job_id' , 'ej.employee_id', 'orders.id as job_id','orders.customer_id as customer_id','c.company_name')
          ->join('job_positions as jb','jb.id','=', 'orders.job_position_id')
          ->join('employee_jobs as ej','orders.id','=','ej.job_id')
          ->join('customers as c', 'c.id' ,'=' , 'orders.customer_id')
          ->where('orders.organization_id', 1)
          ->where('ej.employee_id',$request->employee_id)
          ->where('orders.customer_id',$request->customer_id)
          ->where('ej.status','Active')
          ->groupBy('ej.id')->get();
        }else{
          $employee_jobs=DB::table('orders')->select('jb.*','ej.id as employee_job_id' , 'ej.employee_id', 'orders.id as job_id','orders.customer_id as customer_id','c.company_name')
                ->join('job_positions as jb','jb.id','=', 'orders.job_position_id')
                ->join('employee_jobs as ej','orders.id','=','ej.job_id')
                ->join('customers as c', 'c.id' ,'=' , 'orders.customer_id')
                ->where('orders.organization_id', 1)
                ->where('ej.employee_id',$request->employee_id)
                ->where('ej.status','Active')
                ->groupBy('ej.id')->get();
        }
        
                return response()->json($employee_jobs);
      }

      public function jobs(){
        $jobs = DB::table('orders')->select('ej.id as employee_job_id' , 'jb.name')
                ->join('job_positions as jb','jb.id','=', 'orders.job_position_id')
                ->join('employee_jobs as ej','orders.id','=','ej.job_id')
                // ->where('ej.id' , $request->id)
                ->limit(50)
                ->groupBy('ej.id')->get();
                return response()->json($jobs);
      }
}
