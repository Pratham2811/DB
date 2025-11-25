const { MongoClient } = require('mongodb');

// Connection URL
// IMPORTANT: Transactions ONLY work on a Replica Set.
// If you are on a standalone local instance, you must convert it to a Replica Set first.
const uri = 'mongodb://localhost:27017/?replicaSet=rs0'; 
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('bank');
        const accounts = db.collection('accounts');

        // Setup: Create two accounts if they don't exist
        await accounts.deleteMany({}); // Clear old data
        await accounts.insertMany([
            { _id: 'account-A', balance: 100 },
            { _id: 'account-B', balance: 0 }
        ]);
        console.log('Setup complete: Account A has 100, Account B has 0');

        // --- THE PRACTICAL PART ---
        
        // Approach 1: The "Core API" (Manual Control)
        // You manually start, commit, and abort.
        // PROS: Full control.
        // CONS: You have to handle retries for "TransientTransactionError" manually.
        // We will skip this for the "Better Approach" below.

        // Approach 2: The "Callback API" (Recommended)
        // Uses session.withTransaction()
        // PROS: Automatically retries on transient errors (network blips, locking issues).
        // This is the "Best Practice" way.
        
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                // Step 1: Define the operations
                const amount = 50;

                // Important: You MUST pass { session } to every operation!
                // If you forget this, the operation happens OUTSIDE the transaction.
                
                // Check balance
                const sender = await accounts.findOne({ _id: 'account-A' }, { session });
                if (sender.balance < amount) {
                    // Abort automatically by throwing an error
                    throw new Error('Insufficient funds');
                }

                // Deduct from A
                await accounts.updateOne(
                    { _id: 'account-A' },
                    { $inc: { balance: -amount } },
                    { session }
                );

                // Add to B
                await accounts.updateOne(
                    { _id: 'account-B' },
                    { $inc: { balance: amount } },
                    { session }
                );

                console.log(`Transferred ${amount} from A to B inside transaction...`);
                
                // Simulating a failure? Uncomment the line below to see rollback!
                // throw new Error("Something went wrong before commit!");

            }); 
            // If we get here, the transaction committed successfully!
            console.log('Transaction committed successfully.');

        } catch (e) {
            console.log('Transaction aborted due to error:', e.message);
        } finally {
            await session.endSession();
        }

        // Verify results
        const resultA = await accounts.findOne({ _id: 'account-A' });
        const resultB = await accounts.findOne({ _id: 'account-B' });
        console.log('Final State:');
        console.log('Account A:', resultA.balance);
        console.log('Account B:', resultB.balance);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

main();
