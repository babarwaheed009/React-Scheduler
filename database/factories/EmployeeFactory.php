<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Employee::class;
    public function definition()
    {
    $customer_ids = \App\Models\Customer::pluck('id')->toArray();
        return [
            'first_name' => $this->faker->name,
            'last_name' => $this->faker->name,
            'city' => 'Lahore',
            'cnic' => $this->faker->numerify('35201-#######-#'),
            'country' => 'Pakistan',
            'state' => 'Punjab',
            'customer_id' => $this->faker->randomElement($customer_ids),
        ];
    }
}
