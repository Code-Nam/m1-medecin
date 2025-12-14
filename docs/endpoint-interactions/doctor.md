# Doctor endpoints

**baseUrl**: `{url}/v1/doctors`

## Table of Contents

- [Doctor endpoints](#doctor-endpoints)
  - [Get doctor](#get-doctor)
  - [Request doctor creation](#request-doctor-creation)
  - [Update doctor](#update-doctor)
  - [Request delete doctor](#request-delete-doctor)

## Get doctor

**Method**: `GET`
**Endpoint**: `/`

### Request Template

```json
HEADER
---
{
  "doctorId": "doc_xxxxxx"
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

```json
HEADER
---
{
  "doctorId": "doc_xxxxxx"
}
```

```json
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

```json
HEADER
---
{
  "doctorId": "doc_xxxxxx"
}
```

### Response Template

```json
{
  "message": "Doctor deletion request received and is under review."
}
```
