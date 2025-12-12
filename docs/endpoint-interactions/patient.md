# Patient endpoints

**baseUrl**: `{url}/v1/patients`

## Table of Contents

- [Patient endpoints](#patient-endpoints)
  - [Get patient](#get-patient)
  - [Create patient](#create-patient)
  - [Update patient](#update-patient)
  - [Delete patient](#delete-patient)

## Get patient

**Method**: `GET`
**Endpoint**: `?page={page_number}&pageSize={page_size}`

### Request Template

---

```json
HEADER

---
{
  "patientId": "pat_xxxxxx" / "doctorId": "doc_xxxxxx"
}
```

### Response Template

---

```json
{
  "Surname": "Doe",
  "FirstName": "John",
  "email": "john.doe@gmail.com",
  "phone": "1234567890",
}

```

## Create patient

**Method**: `POST`
**Endpoint**: `/`

### Request Template

---

```json
BODY
---
{
  "Surname": "Doe",
  "FirstName": "John",
  "email": "john.doe@gmail.com",
  "password": "hashed(12345)", (if empty a default password will be generated)
  "phone": "1234567890",
  "assigned_doctor": "doc_xxxxxx" (optional)
}
```

### Response Template

---

```HTTP
HTTP/1.1 201 Created
Content-Type: application/json
```

## Update patient

**Method**: `PUT`
**Endpoint**: `/{patient_id}`

### Request Template

---

```json
HEADER
---
{
  "patientId": "pat_xxxxxx" / "doctorId": "doc_xxxxxx"
}
```

```json
BODY
---
{
  "Surname": "Doe",
  "FirstName": "John",
  "email": "john.doe@gmail.com",
  "password": "12345", (if empty a default password will be generated)
  "phone": "1234567890",
  "assigned_doctor": "doc_xxxxxx" (optional)
}
```

### Response Template

---

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json
```

## Delete patient

**Method**: `DELETE`
**Endpoint**: `/{patient_id}`

### Request Template

---

```HTTP
HEADER
---
{
  "patientId": "pat_xxxxxx"
}
```

### Response Template

---

```HTTP
HTTP/1.1 204 No Content
```
