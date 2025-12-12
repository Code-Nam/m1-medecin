
# Appointments endpoints

**baseUrl**: `{url}/v1/appointments`

## Retrieve Appointments

**Method**: `GET`
**Endpoint**: `/{patient_id}?page={page_number}&pageSize={page_size}`
**Endpoint**: `/{doctor_id}?page={page_number}&pageSize={page_size}`

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
  "appointments": [
    {
      "appointmentId": "appt_xxxxxx",
      "appointedPatient": "pat_xxxxxx",
      "appointedDoctor": "doc_xxxxxx",
      "date": "dd-MM-yyyy",
      "time": "10:00 AM",
      "reason": "Routine Checkup"
    },
    {
      "appointmentId": "appt_xxxxxx",
      "appointedPatient": "pat_xxxxxx",
      "appointedDoctor": "doc_xxxxxx",
      "date": "dd-MM-yyyy",
      "time": "02:00 PM",
      "reason": "Follow-up"
    }
  ],
  "page": 1,
  "totalPages": 3,
  "pageSize": 10,
  "totalAppointments": 25
}
```

## Create appointment

**Method**: `POST`
**Endpoint**: `/`

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
  "appointedPatient": "pat_xxxxxx",
  "appointedDoctor": "doc_xxxxxx",
  "date": "dd-MM-yyyy",
  "time": "10:00 AM",
  "reason": "Routine Checkup"
}
```

### Response Template

---

```HTTP
HTTP/1.1 201 Created
Content-Type: application/json
```

## Update appointment

**Method**: `PUT`
**Endpoint**: `/{appointment_id}`

### Request Template

---

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
  "date": "dd-MM-yyyy",
  "time": "11:00 AM",
  "reason": "Updated Reason"
}
```

### Response Template
---
```HTTP
HTTP/1.1 200 OK
Content-Type: application/json
```

### Delete appointment

**Method**: `DELETE`
**Endpoint**: `/{appointment_id}`

### Request Template
---

```json
HEADER
---
{
  "doctorId": "doc_xxxxxx" / "patientId": "pat_xxxxxx"
}
```

### Response Template
---

```HTTP
HTTP/1.1 204 No Content
```