# Doctor endpoints

**baseUrl**: `{url}/v1/doctors`

## Table of Contents

- [Doctor endpoints](#doctor-endpoints)
  - [Get doctor](#get-doctor)
  - [Get doctors](#get-doctors)
  - [Login doctor](#login-doctor)
  - [Request doctor creation](#request-doctor-creation)
  - [Update doctor](#update-doctor)
  - [Request doctor deletion](#request-doctor-deletion)

## Get doctor

**Method**: `GET`

**Endpoint**: `/{doctor_id}`

### Request Template

```toml
HEADER
---
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // doctor token
}
```

### Response Template

```json
{
  "Surname": "Smith",
  "FirstName": "Jane",
  "specialization": "Cardiology",
  "email": "jane.smith@gmail.com",
  "phone": "0987654321",
}
```

## Get Doctors

**Method**: `GET`

**Endpoint**: `?page={page_number}&pageSize={page_size}`

### Request Template

```toml
BODY
---
  {
    {
      "Surname": "Smith",
      "FirstName": "Jane",
      "specialization": "Cardiology",
      "email": "smith.jane@gmail.com",
      "phone": "0987654321",
    },
    {
      "Surname": "Brown",
      "FirstName": "James",
      "specialization": "Dermatology",
      "email": "brown.james@gmail.com,
      "phone": "1122334455",
    }
  }
```

### Response Template

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json
```

## Login doctor

**Method**: `POST`

**Endpoint**: `/login`

### Request Template

```toml
BODY 
---
{
  "email": "john.smith@gmail.com",
  "password": "hashed_password"
}
```

### Response Template

```toml
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // doctor token
}
```

## Request doctor creation

**Method**: `POST`

**Endpoint**: `/`

### Response Template

```json
{
  "message": "Doctor creation request received and is under review."
}
```

## Update doctor

**Method**: `PUT`

**Endpoint**: `/`

### Request Template

```toml
HEADER
---
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // doctor token
}
```

```toml
BODY
---
{
  "Surname": "Smith",
  "FirstName": "Jane",
  "email": "jane.smith@gmail.com",
  "phone": "0987654321"
}
```

### Response Template

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json
```

## Request doctor deletion

**Method**: `DELETE`

**Endpoint**: `/`

### Request Template

```toml
HEADER
---
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // doctor token
}
```

### Response Template

```json
{
  "message": "Doctor deletion request received and is under review."
}
```
