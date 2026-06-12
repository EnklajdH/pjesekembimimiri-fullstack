<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->orderBy('parent_id')
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function show(Category $category)
    {
        $category->load(['parent', 'children', 'products']);

        return response()->json([
            'category' => $category,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = $this->makeUniqueSlug($data['name']);

        $category = Category::create([
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $slug,
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        if (isset($data['parent_id']) && (int) $data['parent_id'] === (int) $category->id) {
            return response()->json([
                'message' => 'A category cannot be parent of itself.',
            ], 422);
        }

        $category->update([
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $this->makeUniqueSlug($data['name'], $category->id),
        ]);

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category,
        ]);
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Nuk mund ta fshish këtë kategori sepse ka produkte të lidhura me të.',
            ], 422);
        }

        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Nuk mund ta fshish këtë kategori sepse ka nënkategori.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    private function makeUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Category::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'Only admin can perform this action.');
        }
    }
}