<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\orders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\EmployeeAssignmentController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/customers' ,[EmployeeAssignmentController::class,'customers']);
Route::post('/employees/{id?}' ,[EmployeeAssignmentController::class,'employees']);
Route::post('employeeAssignment' ,[EmployeeAssignmentController::class,'index']);
Route::post('employeeJobs' ,[EmployeeAssignmentController::class,'employeeJobs']);
Route::get('jobs' ,[EmployeeAssignmentController::class,'jobs']);
// Route::post('employeeAssignmentAjax' ,[EmployeeAssignmentController::class,'ajax']);
Route::post('postEmployeeSchedule' ,[EmployeeAssignmentController::class,'ajax']);
Route::post('deleteEmployeeSchedule' ,[EmployeeAssignmentController::class,'deleteEmployeeSchedule']);