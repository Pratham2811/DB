
# MongoDB Validation: `validationLevel` and `validationAction`

## 1. Overview

MongoDB schema validation needs to answer two key questions:

### 1. **When should MongoDB validate documents?**  
→ Controlled by **`validationLevel`**

### 2. **What should MongoDB do when validation fails?**  
→ Controlled by **`validationAction`**

---

# 2. `validationLevel` — When Validation Happens

Controls **how strictly MongoDB applies validation rules**.

---

## ✅ `off`
```json
"validationLevel": "off"
```
- No validation applied.
- MongoDB ignores schema rules.
- Same as having *no validator*.

---

## ✅ `moderate`
```json
"validationLevel": "moderate"
```
- Validates **only new inserts**.
- Validates **documents that are being updated**.
- **Existing invalid documents are allowed** unless modified.

### Best for:
- Migration from unstructured → structured data.
- Adding validators to old collections.
- Avoiding breaking existing applications.

---

## ✅ `strict`
```json
"validationLevel": "strict"
```
- Validates **every insert** and **every update**.
- Document must be valid **before AND after** update.
- Database behaves like a strict SQL system.

### Best for:
- Clean production environments.
- When all data is already validated.

---

# 3. `validationAction` — What Happens When Validation Fails

Controls **MongoDB's reaction** when a document violates the schema.

---

## ✅ `error`
```json
"validationAction": "error"
```
- Rejects the write.
- Client receives validation error.
- True enforcement of schema.

---

## ✅ `warn`
```json
"validationAction": "warn"
```
- Allows the write **even if invalid**.
- Logs a warning in MongoDB server logs.
- Does *not* throw an error to application.

### Best for:
- Testing schema without breaking anything.
- Monitoring violations.
- Gradual rollout of strict validation.

---

# 4. Combined Behavior Table

| `validationLevel` | `validationAction` | Behavior |
|-------------------|--------------------|----------|
| strict | error | Reject all invalid writes (hard enforcement) |
| strict | warn | Validate all writes, allow but warn |
| moderate | error | Validate new/updated docs; reject invalid ones |
| moderate | warn | Validate new/updated docs; allow but warn |
| off | any | Validation disabled |

---

# 5. Real-World Use Cases

## 🔥 Phase 1 — Introducing Schema to Existing Collection
Use:
```json
"validationLevel": "moderate",
"validationAction": "warn"
```

Why?
- Doesn't break current system.
- Warns you when invalid data is written.
- Gives time to clean old documents.

---

## 🔥 Phase 2 — After Cleaning Up Data
Switch to:
```json
"validationLevel": "strict",
"validationAction": "error"
```

Now MongoDB enforces:
- 100% strict schema validation.
- No invalid documents allowed.

---

# 6. Mental Model (Very Important)

### `validationLevel` = **Where the guard stands**
- **off** → guard sleeping  
- **moderate** → checks only new people  
- **strict** → checks everyone  

### `validationAction` = **What the guard does**
- **warn** → lets you in but shouts  
- **error** → stops you at the gate  

---

# 7. Example Commands

## Soft rollout
```js
db.runCommand({
  collMod: "users",
  validator: { $jsonSchema: { ... } },
  validationLevel: "moderate",
  validationAction: "warn"
});
```

## Hard enforcement
```js
db.runCommand({
  collMod: "users",
  validator: { $jsonSchema: { ... } },
  validationLevel: "strict",
  validationAction: "error"
});
```

---

# 8. Summary

### `validationLevel`
- **off** → No validation  
- **moderate** → Validate only new/updated docs  
- **strict** → Validate everything  

### `validationAction`
- **warn** → Allow invalid but warn  
- **error** → Reject invalid writes  

These two flags control **how strict MongoDB enforces your schema** during inserts and updates.
