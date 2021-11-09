<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BookUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'max:255|string',
            'language' => 'string|max:255|nullable',
            'publication_date' => 'date|nullable',
            'description' => 'string',
            'publisher' => 'string|max:255',
            'pages_num' => 'numeric|nullable',
            'branch_slug' => 'numeric',
        ];
    }

    protected function failedValidation(Validator $validator) {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            if (!auth()->user()->hasPermissionTo('update-book-branch') && auth()->user()->branch_id !== $validator->validated()['branch_slug']) {
                $validator->errors()->add('message', 'You cannot change branch slug for this book. Please create request for admin');
            }
        });
    }
}
