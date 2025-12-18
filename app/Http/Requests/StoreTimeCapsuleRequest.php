<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimeCapsuleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow both authenticated users and guests
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'reveal_date' => 'required|date|after:now',
            'is_public' => 'sometimes|boolean',
            'message' => 'nullable|string|max:5000',
            'email_recipients' => 'nullable|json',
            'artifacts' => 'nullable|array|max:' . config('capsule.max_artifacts', 50),
            'artifacts.*.title' => 'nullable|string|max:255',
            'artifacts.*.description' => 'nullable|string|max:2000',
            'artifacts.*.year' => 'nullable|integer|min:1800|max:2100',
            'artifacts.*.type' => 'nullable|string|max:50',
            'artifacts.*.file' => 'nullable|file|max:' . config('capsule.max_file_size_mb', 20) * 1024,
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Time capsule title is required.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'description.max' => 'Description cannot exceed 2000 characters.',
            'reveal_date.required' => 'Reveal date is required.',
            'reveal_date.after' => 'Reveal date must be in the future.',
            'message.max' => 'Message cannot exceed 5000 characters.',
            'artifacts.max' => 'Cannot have more than ' . config('capsule.max_artifacts', 50) . ' artifacts.',
            'artifacts.*.title.max' => 'Artifact title cannot exceed 255 characters.',
            'artifacts.*.description.max' => 'Artifact description cannot exceed 2000 characters.',
            'artifacts.*.year.min' => 'Artifact year must be 1800 or later.',
            'artifacts.*.year.max' => 'Artifact year cannot be later than 2100.',
            'artifacts.*.file.max' => 'Each file cannot exceed ' . config('capsule.max_file_size_mb', 20) . 'MB.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Validation\ValidationException($validator);
    }
}