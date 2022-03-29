<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Customer;
use App\Models\Employee;
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

Route::get('/customers' , function(){
    $customer = Customer::all();
    return response()->json($customer);
});

Route::get('/employees/{id?}' , function($id=null){
    if($id){
        $employees = Employee::where('customer_id' , $id)->get();
    }else{
        $employees = Employee::all();
    }
    return response()->json($employees);
});
