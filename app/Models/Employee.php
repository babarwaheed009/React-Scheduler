<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $table = 'babar_employees';
    public $timestamps = false;
    public $fillable = ['id','first_name','last_name','city','country','cnic','state','customer_id'];
}
