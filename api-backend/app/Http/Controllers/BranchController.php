<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Services\BranchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    protected $branchService;

    public function __construct(BranchService $branchService)
    {
        $this->branchService = $branchService;
        
       
    }

    public function index(Request $request): JsonResponse
    {
        $branches = $this->branchService->getAllBranches($request->all());
        return response()->json($branches);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact_phone' => 'required|string|max:20',
            'manager_id' => 'nullable|uuid|exists:users,id',
            'status' => ['required', Rule::in(['open', 'closed', 'temporarily_closed'])],
        ]);

        $branch = $this->branchService->createBranch($validated);
        return response()->json($branch, 201);
    }

    public function show(string $id): JsonResponse
    {
        $branch = $this->branchService->getBranch($id);
        return response()->json($branch);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string',
            'contact_phone' => 'sometimes|required|string|max:20',
            'manager_id' => 'nullable|uuid|exists:users,id',
            'status' => ['sometimes', 'required', Rule::in(['open', 'closed', 'temporarily_closed'])],
        ]);

        $branch = $this->branchService->updateBranch($id, $validated);
        return response()->json($branch);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->branchService->deleteBranch($id);
        return response()->json(['message' => 'Branch deleted successfully']);
    }

    public function restore(string $id): JsonResponse
    {
        $branch = $this->branchService->restoreBranch($id);
        return response()->json($branch);
    }
}