<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeSchedule extends Model
{
    use HasFactory;
    protected static $logAttributes = ['*'];
    protected $fillable = [
        'employee_job_id',
        'employee_id',
        'time_from',
        'time_to',
        'schedule_date',
        'color',
        'shift_id',
        'shift_notes',
        'repeat_till',
        'repeat_type',
        'repeat_on',
        'repeat_frequency'
    ];
}
