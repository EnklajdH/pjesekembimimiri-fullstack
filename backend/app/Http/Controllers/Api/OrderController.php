<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:255'],
            'customer_city' => ['nullable', 'string', 'max:255'],
            'customer_address' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],

            'currency' => ['required', 'in:EUR,ALL'],
            'payment_method' => ['required', 'in:whatsapp,card'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $user = auth('sanctum')->user();

        $order = DB::transaction(function () use ($data, $user) {
            $total = 0;
            $itemsToCreate = [];

            foreach ($data['items'] as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->firstOrFail();

                if ($product->stock < $item['quantity']) {
                    abort(422, "Produkti '{$product->title}' nuk ka stok të mjaftueshëm.");
                }

                $lineTotal = (float) $product->price * (int) $item['quantity'];
                $total += $lineTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'product_model' => $product->model,
                    'quantity' => (int) $item['quantity'],
                    'price' => $product->price,
                    'currency' => $product->currency,
                ];

                $product->stock = $product->stock - (int) $item['quantity'];

                if ($product->stock <= 0) {
                    $product->status = 'sold';
                }

                $product->save();
            }

            $order = Order::create([
                'user_id' => $user?->id,
                'order_type' => $user ? 'customer' : 'guest',

                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'],
                'customer_city' => $data['customer_city'] ?? null,
                'customer_address' => $data['customer_address'],
                'notes' => $data['notes'] ?? null,

                'total' => $total,
                'currency' => $data['currency'],

                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'not_required',
                'status' => 'pending',
            ]);

            foreach ($itemsToCreate as $orderItem) {
                $order->items()->create($orderItem);
            }

            return $order->load(['items', 'user']);
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
        ], 201);
    }

    public function myOrders(Request $request)
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $this->authorizeAdmin($request);

        $orders = Order::with(['items', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,completed,cancelled'],
            'payment_status' => ['nullable', 'in:pending,paid,failed,not_required'],
        ]);

        $order->update([
            'status' => $data['status'],
            'payment_status' => $data['payment_status'] ?? $order->payment_status,
        ]);

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => $order->load(['items', 'user']),
        ]);
    }

    public function destroy(Request $request, Order $order)
    {
        $this->authorizeAdmin($request);

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'Only admin can perform this action.');
        }
    }
}