# MongoDB Transactions: The Complete Guide
*(From Basics to Internals to Hands-on)*

## Part 1: The Basics (Simple English)

### What is a Transaction?
Imagine you are buying a coffee with a credit card. Two things must happen:
1.  **Money leaves your account.**
2.  **Money enters the coffee shop's account.**

If the system crashes after step 1 but before step 2, you lose money, and the shop gets nothing. That is bad.
A **Transaction** ensures that either **BOTH** happen, or **NEITHER** happens. It's "All or Nothing."

### Why did MongoDB not have this before?
In SQL databases (like MySQL), you split data into many tables (Users table, Orders table). To create an order, you *have* to update both tables. So, transactions are essential.

In MongoDB, we usually store everything in one document:
```json
{
  "user": "Alice",
  "orders": [ { "item": "Coffee", "price": 5 } ]
}
```
Updating this *one* document is **always** atomic (safe). So for 90% of cases, you didn't need special transactions. But for the other 10% (like moving money between two *different* users), we need them.

---

## Part 2: The Internals (Deep Dive)
*How does it actually work under the hood?*

### 1. The "Snapshot" (Isolation)
Imagine you are taking a group photo. You say "Cheese!", and the camera captures that exact moment.
*   **WiredTiger** (MongoDB's brain) does the same. When you start a transaction, it takes a **Snapshot** of the data.
*   If you are reading data inside a transaction, you only see the data from that snapshot.
*   Even if someone else changes the data *while* you are working, you still see the old version from your photo. This is called **Snapshot Isolation**.

### 2. MVCC (Multi-Version Concurrency Control)
This is a fancy name for a simple concept: **Don't overwrite, just add a new version.**
*   When you update a document, MongoDB doesn't delete the old one yet.
*   It keeps the **Old Version** (for people reading the snapshot) and creates a **New Version** (for your transaction).
*   If you **Commit** (save), the New Version becomes the real one.
*   If you **Abort** (cancel), the New Version is thrown away.

### 3. The Oplog (The "All-or-Nothing" Log)
MongoDB replicates data to other servers using an **Oplog** (Operations Log).
*   Normally: Every little change is written to the log one by one.
*   **In a Transaction**: MongoDB waits. It collects *all* your changes. When you commit, it writes them all as **ONE giant entry** (called `applyOps`).
*   This ensures that other servers receive *all* the changes at the exact same instant. They never see "half" a transaction.

---

## Part 3: Hands-on Workshop (Step-by-Step)

We will build a script to transfer money between two wallets. We will use **ES6 Syntax** (`import`, `const`, `await`).

### Step 0: Setup
1.  Make sure you have a `package.json` with `"type": "module"` to use ES6.
2.  Install MongoDB: `npm install mongodb`

### Step 1: The Code Structure
Create a file `transaction_workshop.js`.

```javascript
import { MongoClient } from 'mongodb';

// 1. Connection
// Transactions REQUIRE a Replica Set.
const uri = 'mongodb://localhost:27017/?replicaSet=rs0';
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log('Connected!');

        // 2. Setup Data
        const db = client.db('finance');
        const wallets = db.collection('wallets');
        
        // Reset for demo
        await wallets.deleteMany({});
        await wallets.insertMany([
            { _id: 'Alice', balance: 50 },
            { _id: 'Bob', balance: 0 }
        ]);
        console.log('Initial State: Alice has 50, Bob has 0');

        // --- TRANSACTION STARTS HERE ---
        await transferMoney(client, 'Alice', 'Bob', 20);

    } finally {
        await client.close();
    }
}

main();
```

### Step 2: The `transferMoney` Function
This is where the magic happens. We use `session.withTransaction()`.

```javascript
async function transferMoney(client, fromId, toId, amount) {
    // 1. Start a Session
    const session = client.startSession();

    try {
        // 2. Use withTransaction (The Safe Way)
        // It automatically retries if there is a network blip or a lock error.
        await session.withTransaction(async () => {
            
            const wallets = client.db('finance').collection('wallets');

            // IMPORTANT: Pass { session } to EVERY command!
            
            // A. Check Balance
            const sender = await wallets.findOne({ _id: fromId }, { session });
            if (sender.balance < amount) {
                // If we throw an error here, the transaction automatically Aborts (Rolls back).
                throw new Error(`Insufficient funds for ${fromId}`);
            }

            // B. Deduct Money
            await wallets.updateOne(
                { _id: fromId },
                { $inc: { balance: -amount } },
                { session }
            );

            // C. Add Money
            await wallets.updateOne(
                { _id: toId },
                { $inc: { balance: amount } },
                { session }
            );

            console.log(`Transferred ${amount} from ${fromId} to ${toId}`);
            // When this function finishes, MongoDB automatically COMMITS.
        });

        console.log('Transaction Successful!');

    } catch (error) {
        console.error('Transaction Failed:', error.message);
        // No need to manually abort, withTransaction handles it.
    } finally {
        // 3. Always end the session
        await session.endSession();
    }
}
```

### Why is this better?
*   **Safety**: If the code fails after "Deduct Money" but before "Add Money", the `withTransaction` helper catches the error and **undoes** the deduction. Alice gets her money back.
*   **Retries**: If the database is busy (locking issues), `withTransaction` will automatically try again for you.

### Try it yourself!
1.  Run the code. You should see Alice: 30, Bob: 20.
2.  Change `amount` to 100. Run it. You should see "Transaction Failed: Insufficient funds", and balances stay 50/0.
