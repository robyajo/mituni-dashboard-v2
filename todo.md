### Required Request Body

untuk branch_id gunakan selalu ini
import { useActiveOutlet } from "@/store/useOutletStore";

const { outlet_id_active } = useActiveOutlet();
const activeBranchId = outlet_id_active;

### Endpoint API

`POST /api/email/verify` // endpoint untuk verifikasi email atau whatsapp jika dipilih salah satu user maka lakukan verifikasi tersebut

### Request Body

```json
{
  "otp": "185480"
}
```

### Respon

```json
{
  "success": false,
  "message": "Kode OTP salah atau tidak ditemukan"
}
```

### Endpoint API

`POST /api/email/request-verification` // endpoint untuk meminta verifikasi email atau whatsapp jika dipilih salah satu user maka lakukan verifikasi tersebut

### Respon

```json
{
  "success": true,
  "message": "Kode OTP verifikasi berhasil dikirim ke email Anda",
  "data": {
    "email": "testidng@gmail.com",
    "expires_in": "3 minutes"
  }
}
```
