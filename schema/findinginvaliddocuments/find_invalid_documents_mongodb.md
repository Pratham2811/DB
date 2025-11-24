
# Finding Invalid Documents in a MongoDB Collection (Step-by-Step Guide)

This guide shows you **step by step** how to find **invalid documents** in a MongoDB collection that already has a **schema validator** using `$jsonSchema`.

---

## 🧠 Goal

We want to:
1. Use the **same `$jsonSchema`** as the collection validator.
2. Find all documents that **do NOT match** that schema.
3. Optionally, run **targeted checks** for specific validation errors (missing fields, wrong types, etc.).

---

## ✅ Prerequisites

- You already have a collection, e.g. `users`.
- The collection has a validator with `$jsonSchema`, defined using:
  - `db.createCollection(...)` **or**
  - `db.runCommand({ collMod: ... })`

Example validator (for understanding):

```js
{
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "createdAt"],
    properties: {
      name: { bsonType: "string" },
      email: {
        bsonType: "string",
        pattern: "^.+@.+\\..+$"
      },
      createdAt: { bsonType: "date" },
      age: {
        bsonType: "int",
        minimum: 0,
        maximum: 120
      }
    },
    additionalProperties: false
  }
}
```

---

## 🔹 METHOD 1: Generic – Use `$jsonSchema` + `$nor` to find ALL invalid documents

This method reuses the **same schema** MongoDB uses for validation, and finds documents that **do NOT satisfy it**.

### 🪜 Step 1 – Open `mongosh`

In your terminal:

```bash
mongosh
```

Select your database:

```js
use YourDatabaseName
```

---

### 🪜 Step 2 – Read the current validator from the collection

Run:

```js
const info = db.getCollectionInfos({ name: "users" })[0];
info;
```

Look at:

```js
info.options.validator
```

If your collection uses `$jsonSchema`, you’ll see something like:

```js
{
  $jsonSchema: {
    bsonType: "object",
    required: [...],
    properties: { ... },
    additionalProperties: false
  }
}
```

Extract the schema into a variable:

```js
const schema = info.options.validator.$jsonSchema;
schema;
```

Now `schema` contains the same `$jsonSchema` used by MongoDB’s validator.

---

### 🪜 Step 3 – Find documents that FAIL the schema

Use `$jsonSchema` with `$nor` to get all invalid documents:

```js
db.users.find({
  $nor: [
    { $jsonSchema: schema }
  ]
});
```

**Explanation:**

- `{ $jsonSchema: schema }` → matches **valid** documents.
- Wrapping it in `$nor: [ ... ]` → negates it → returns **documents that are NOT valid**.

These are the documents that:

- Would **fail validation** if `validationAction` was `"error"`.
- Do NOT conform to your `$jsonSchema`.

---

### 🪜 Step 4 – Count how many invalid documents exist

Instead of listing all, you can count them:

```js
db.users.countDocuments({
  $nor: [
    { $jsonSchema: schema }
  ]
});
```

This gives you the **number of invalid documents**.

---

### 🪜 Step 5 – Inspect & fix invalid documents

You can loop through them and manually fix:

```js
db.users.find({
  $nor: [
    { $jsonSchema: schema }
  ]
}).forEach(doc => {
  printjson(doc);
});
```

Then:

- Decide whether to **update**, **delete**, or **normalize** them using `updateOne` / `updateMany`.
- After cleanup, you can safely set:

```js
db.runCommand({
  collMod: "users",
  validationLevel: "strict",
  validationAction: "error"
});
```

From that point, **no invalid document can enter** the collection.

---

## 🔹 METHOD 2: Targeted Checks – Find Specific Validation Problems

Sometimes you want to know **exactly what is wrong**, e.g.:

- Missing required fields
- Wrong types
- Wrong ranges
- Invalid email format, etc.

We’ll use the same logical rules as your `$jsonSchema`.

Assume same schema:

```js
{
  bsonType: "object",
  required: ["name", "email", "createdAt"],
  properties: {
    name: { bsonType: "string" },
    email: {
      bsonType: "string",
      pattern: "^.+@.+\\..+$"
    },
    createdAt: { bsonType: "date" },
    age: {
      bsonType: "int",
      minimum: 0,
      maximum: 120
    }
  },
  additionalProperties: false
}
```

---

### 🪜 Step 1 – Find documents with missing required fields

#### Missing `name`:

```js
db.users.find({
  name: { $exists: false }
});
```

#### Missing `email`:

```js
db.users.find({
  email: { $exists: false }
});
```

#### Missing `createdAt`:

```js
db.users.find({
  createdAt: { $exists: false }
});
```

---

### 🪜 Step 2 – Find fields with wrong types

#### `name` not a string:

```js
db.users.find({
  name: { $exists: true, $not: { $type: "string" } }
});
```

#### `age` not an integer:

```js
db.users.find({
  age: { $exists: true, $not: { $type: "int" } }
});
```

#### `createdAt` not a date:

```js
db.users.find({
  createdAt: { $exists: true, $not: { $type: "date" } }
});
```

---

### 🪜 Step 3 – Find values outside allowed range

Age must be between `0` and `120`.

#### Age < 0:

```js
db.users.find({
  age: { $lt: 0 }
});
```

#### Age > 120:

```js
db.users.find({
  age: { $gt: 120 }
});
```

---

### 🪜 Step 4 – Find invalid email formats

For the pattern:

```js
pattern: "^.+@.+\\..+$"
```

Invalid email examples are those that:

- Don’t contain `@`
- Don’t contain a `.` after `@`

Find mismatched emails:

```js
db.users.find({
  email: {
    $exists: true,
    $not: { $regex: /.+@.+\..+/ }
  }
});
```

---

### 🪜 Step 5 – Find documents with extra fields (when `additionalProperties: false`)

MongoDB doesn’t provide a direct built-in way to list “extra fields” beyond schema, but you can:

1. Decide the **expected field list**, e.g.:

   ```txt
   _id, name, email, createdAt, age
   ```

2. Export or inspect documents and write custom scripts (in Node.js / Python) to:
   - Iterate over keys.
   - Flag any field that is **not** in your expected set.

This is usually done from the **application side**, not with a pure Mongo query.

---

## 🔹 METHOD 3: Use Aggregation Pipeline (Alternative to `find`)

You can also use **aggregation** to find invalid documents using `$jsonSchema` + `$match`.

### Example:

```js
db.users.aggregate([
  {
    $match: {
      $nor: [
        { $jsonSchema: schema }
      ]
    }
  }
]);
```

Same logic as `find`, but now inside a pipeline.

You can then:

- `$project` specific fields
- `$group` by error type
- `$out` to another collection for reporting

---

## ✅ Recommended Workflow (Production-Safe)

1. **Define or read** your `$jsonSchema` from the collection.
2. Use **METHOD 1** to list all invalid docs:

   ```js
   db.users.find({
     $nor: [
       { $jsonSchema: schema }
     ]
   });
   ```

3. If you need more detail on what's wrong, use **METHOD 2** with targeted queries.
4. Clean data **using `updateOne` / `updateMany` / deletes**.
5. Once the collection is clean, enforce strict validation:

   ```js
   db.runCommand({
     collMod: "users",
     validationLevel: "strict",
     validationAction: "error"
   });
   ```

Now your collection is:

- **Strict**
- **Clean**
- Protected from invalid future data.

---

## 🧾 Summary

- `$jsonSchema` + `$nor` is the fastest way to find **all** invalid documents.
- Targeted queries let you see **which rule is broken**:
  - Missing fields,
  - Wrong types,
  - Range violations,
  - Pattern mismatches.
- Clean your data first, then switch to `strict + error` for **strong protection**.
