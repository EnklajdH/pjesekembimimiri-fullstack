<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')
            ->where('status', 'active');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('oem', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'products' => $query->latest()->get(),
        ]);
    }

    public function show(Product $product)
    {
        $product->load('category');

        return response()->json([
            'product' => $product,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'products' => Product::with('category')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'in:EUR,ALL'],
            'stock' => ['required', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:255'],
            'origin' => ['nullable', 'string', 'max:255'],
            'oem' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:active,hidden,sold'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'description' => ['nullable', 'string'],
        ]);

        $imagePath = $data['image'] ?? null;

        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
        }

        $product = Product::create([
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'slug' => $this->makeUniqueSlug($data['title']),
            'model' => $data['model'],
            'price' => $data['price'],
            'currency' => $data['currency'],
            'stock' => $data['stock'],
            'condition' => $data['condition'] ?? 'E përdorur origjinale',
            'origin' => $data['origin'] ?? 'Gjermani',
            'oem' => $data['oem'] ?? null,
            'status' => $data['status'],
            'image' => $imagePath,
            'description' => $data['description'] ?? null,
        ]);

        $product->load('category');

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'in:EUR,ALL'],
            'stock' => ['required', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:255'],
            'origin' => ['nullable', 'string', 'max:255'],
            'oem' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:active,hidden,sold'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'description' => ['nullable', 'string'],
        ]);

        $imagePath = $data['image'] ?? $product->image;

        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
        }

        $product->update([
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'slug' => $this->makeUniqueSlug($data['title'], $product->id),
            'model' => $data['model'],
            'price' => $data['price'],
            'currency' => $data['currency'],
            'stock' => $data['stock'],
            'condition' => $data['condition'] ?? 'E përdorur origjinale',
            'origin' => $data['origin'] ?? 'Gjermani',
            'oem' => $data['oem'] ?? null,
            'status' => $data['status'],
            'image' => $imagePath,
            'description' => $data['description'] ?? null,
        ]);

        $product->load('category');

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product,
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        $this->authorizeAdmin($request);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    private function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, function ($query) use ($ignoreId) {
                    return $query->where('id', '!=', $ignoreId);
                })
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