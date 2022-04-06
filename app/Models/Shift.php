<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $appends = ['shift_slot'];
    protected static $logAttributes = ['*'];
    
    function getShiftSlotAttribute() {
        if($this->time_from < 12){
            return "morning";
        }elseif($this->time_from > 11 && $this->time_from < 18){
            return "evening";
        }elseif($this->time_from > 17){
            return "night";
        }
    }

}
