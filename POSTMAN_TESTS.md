# Smart Inventory System - Postman Testing Guide

## 🧪 **Complete Postman Test Collection**

### **Prerequisites:**
1. Start your Spring Boot application: `mvn spring-boot:run`
2. Application should be running on: `http://localhost:3020`
3. Database should be initialized with default users

---

## **Test Collection 1: Authentication Tests**

### **Test 1.1: Login as Manager (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "manager@inventory.com",
  "password": "manager123"
}

Expected Response (200 OK):
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "fullName": "System Manager",
    "email": "manager@inventory.com",
    "role": "MANAGER"
  }
}
```

### **Test 1.2: Login as Admin (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "admin@inventory.com",
  "password": "admin123"
}

Expected Response (200 OK):
{
  "message": "Login successful",
  "user": {
    "id": 2,
    "fullName": "System Administrator",
    "email": "admin@inventory.com",
    "role": "ADMIN"
  }
}
```

### **Test 1.3: Invalid Login - Wrong Email (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "wrong@inventory.com",
  "password": "manager123"
}

Expected Response (400 Bad Request):
User not found
```

### **Test 1.4: Invalid Login - Wrong Password (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "manager@inventory.com",
  "password": "wrongpassword"
}

Expected Response (400 Bad Request):
Invalid password
```

---

## **Test Collection 2: User Management Tests**

### **Test 2.1: Get All Users - No Authentication (FAIL)**
```
Method: GET
URL: http://localhost:3020/api/users

Expected Response (401 Unauthorized):
Unauthorized access
```

### **Test 2.2: Get All Users - As Manager (SUCCESS)**
```
Method: GET
URL: http://localhost:3020/api/users
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123

Expected Response (200 OK):
[
  {
    "id": 1,
    "fullName": "System Manager",
    "email": "manager@inventory.com",
    "role": {
      "id": 1,
      "name": "MANAGER",
      "description": "Inventory Manager"
    }
  },
  {
    "id": 2,
    "fullName": "System Administrator", 
    "email": "admin@inventory.com",
    "role": {
      "id": 2,
      "name": "ADMIN",
      "description": "System Administrator"
    }
  }
]
```

### **Test 2.3: Get All Users - As Admin (SUCCESS)**
```
Method: GET
URL: http://localhost:3020/api/users
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123

Expected Response (200 OK):
[List of all users]
```

### **Test 2.4: Get User by ID - As Manager (SUCCESS)**
```
Method: GET
URL: http://localhost:3020/api/users/1
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123

Expected Response (200 OK):
{
  "id": 1,
  "fullName": "System Manager",
  "email": "manager@inventory.com",
  "role": {
    "id": 1,
    "name": "MANAGER",
    "description": "Inventory Manager"
  }
}
```

---

## **Test Collection 3: User Creation Tests**

### **Test 3.1: Create Agent User - As Manager (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "New Agent User",
  "email": "agent1@inventory.com",
  "password": "agent123",
  "phone": "1234567890",
  "role": "AGENT"
}

Expected Response (200 OK):
{
  "message": "User created successfully",
  "userId": 3
}
```

### **Test 3.2: Create Admin User - As Manager (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "New Admin User",
  "email": "admin2@inventory.com",
  "password": "admin123",
  "phone": "9876543210",
  "role": "ADMIN"
}

Expected Response (200 OK):
{
  "message": "User created successfully",
  "userId": 4
}
```

### **Test 3.3: Create Manager User - As Manager (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "New Manager User",
  "email": "manager2@inventory.com",
  "password": "manager123",
  "phone": "5555555555",
  "role": "MANAGER"
}

Expected Response (200 OK):
{
  "message": "User created successfully",
  "userId": 5
}
```

### **Test 3.4: Create Manager User - As Admin (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "Unauthorized Manager",
  "email": "badmanager@inventory.com",
  "password": "password123",
  "phone": "7777777777",
  "role": "MANAGER"
}

Expected Response (400 Bad Request):
Only MANAGER can create other MANAGER users
```

### **Test 3.5: Create Admin User - As Admin (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "Unauthorized Admin",
  "email": "badmin@inventory.com",
  "password": "password123",
  "phone": "8888888888",
  "role": "ADMIN"
}

Expected Response (400 Bad Request):
Only MANAGER can create ADMIN users
```

### **Test 3.6: Create Agent User - As Admin (SUCCESS)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "Agent by Admin",
  "email": "agent2@inventory.com",
  "password": "agent123",
  "phone": "3333333333",
  "role": "AGENT"
}

Expected Response (200 OK):
{
  "message": "User created successfully",
  "userId": 6
}
```

### **Test 3.7: Create Duplicate Email (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "Duplicate User",
  "email": "manager@inventory.com",
  "password": "password123",
  "phone": "9999999999",
  "role": "AGENT"
}

Expected Response (400 Bad Request):
Email already exists
```

---

## **Test Collection 4: Role Management Tests**

### **Test 4.1: Get Users by Role - AGENT (SUCCESS)**
```
Method: GET
URL: http://localhost:3020/api/users/role/AGENT
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123

Expected Response (200 OK):
[List of users with AGENT role]
```

### **Test 4.2: Get Users by Role - MANAGER (SUCCESS)**
```
Method: GET
URL: http://localhost:3020/api/users/role/MANAGER
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123

Expected Response (200 OK):
[List of users with MANAGER role]
```

### **Test 4.3: Update User Role - As Manager (SUCCESS)**
```
Method: PUT
URL: http://localhost:3020/api/users/3/role
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "role": "ADMIN"
}

Expected Response (200 OK):
{
  "message": "User role updated successfully"
}
```

### **Test 4.4: Update User Role - As Admin (FAIL)**
```
Method: PUT
URL: http://localhost:3020/api/users/3/role
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "role": "MANAGER"
}

Expected Response (403 Forbidden):
Access denied
```

---

## **Test Collection 5: User Deletion Tests**

### **Test 5.1: Delete User - As Manager (SUCCESS)**
```
Method: DELETE
URL: http://localhost:3020/api/users/6
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123

Expected Response (200 OK):
{
  "message": "User deleted successfully"
}
```

### **Test 5.2: Delete User - As Admin (FAIL)**
```
Method: DELETE
URL: http://localhost:3020/api/users/5
Authorization: 
  Type: Basic Auth
  Username: admin@inventory.com
  Password: admin123

Expected Response (403 Forbidden):
Access denied
```

### **Test 5.3: Delete Non-existent User (FAIL)**
```
Method: DELETE
URL: http://localhost:3020/api/users/999
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123

Expected Response (404 Not Found):
User not found
```

---

## **Test Collection 6: Security Validation Tests**

### **Test 6.1: SQL Injection Attempt (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "admin@inventory.com",
  "password": "' OR '1'='1"
}

Expected Response (400 Bad Request):
Invalid password
```

### **Test 6.2: XSS Attempt in User Creation (FAIL)**
```
Method: POST
URL: http://localhost:3020/api/users/create
Authorization: 
  Type: Basic Auth
  Username: manager@inventory.com
  Password: manager123
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "fullName": "<script>alert('XSS')</script>",
  "email": "xss@inventory.com",
  "password": "password123",
  "phone": "1111111111",
  "role": "AGENT"
}

Expected Response: Should create user but sanitize the script tags
```

---

## **🎯 Quick Test Summary Checklist**

**✅ Authentication (4 tests):**
- [ ] Manager login works
- [ ] Admin login works  
- [ ] Invalid email fails
- [ ] Invalid password fails

**✅ Authorization (8 tests):**
- [ ] Unauthenticated access fails
- [ ] Manager can view users
- [ ] Admin can view users
- [ ] Manager can create all roles
- [ ] Admin cannot create MANAGER/ADMIN
- [ ] Admin can create AGENT
- [ ] Only MANAGER can update roles
- [ ] Only MANAGER can delete users

**✅ Data Validation (3 tests):**
- [ ] Duplicate email fails
- [ ] Required fields validation
- [ ] Invalid role fails

**✅ Security (2 tests):**
- [ ] SQL injection blocked
- [ ] XSS attempts handled

---

## **🔧 Postman Collection Setup**

1. **Create New Collection**: "Smart Inventory Tests"
2. **Set Collection Variables**:
   - `base_url`: `http://localhost:3020`
   - `manager_email`: `manager@inventory.com`
   - `manager_password`: `manager123`
   - `admin_email`: `admin@inventory.com`
   - `admin_password`: `admin123`

3. **Use Variables in Requests**:
   - URL: `{{base_url}}/api/auth/login`
   - Auth: `{{manager_email}}` / `{{manager_password}}`

This gives you **25+ comprehensive tests** to verify every aspect of your Smart Inventory system is working correctly!
