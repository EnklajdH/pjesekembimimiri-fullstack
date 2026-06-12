# Pjesë Këmbimi Miri

Fullstack project concept for `pjesekembimimiri.al`.

Motoja: **Gjithmonë pjesë këmbimi origjinale të përdorura nga Gjermania.**

## Çfarë përfshin ZIP-i

- `frontend/` React + Vite + Tailwind website
- Public website: Home, Products, Product Details, Cart, Checkout, Contact + Google Maps
- Admin panel: Dashboard, CRUD Categories, CRUD Products
- Cart me localStorage
- WhatsApp checkout me mesazh automatik
- Categories dhe products ruhen në localStorage për demo
- `backend/` Laravel API plan/skeleton për fazën tjetër

## Si ta hapësh frontend-in

```bash
cd frontend
npm install
npm run dev
```

Hape në browser:

```text
http://localhost:5173
```

## Admin demo

Shko te:

```text
/admin/login
```

Kliko Login. Për momentin është demo pa backend authentication.

## Çfarë mund të bëjë admini

- Shton kategori kryesore, p.sh. Karroceria
- Shton nënkategori, p.sh. Karroceria > Parakolp
- Editon kategori
- Fshin kategori
- Shton pjesë, p.sh. Parakolp para Mercedes C-Class W204
- Editon pjesë
- Fshin pjesë
- Vendos modelin, çmimin, monedhën, stokun, OEM code, statusin dhe foton

## Si lidhet me Laravel më vonë

Frontend aktualisht përdor localStorage. Në backend Laravel do krijohen endpoints:

```text
GET /api/categories
POST /api/categories
PUT /api/categories/{id}
DELETE /api/categories/{id}

GET /api/products
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

POST /api/orders
POST /api/admin/login
```

Pastaj në React zëvendësohet localStorage me Axios API calls.
