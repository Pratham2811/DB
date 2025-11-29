I'm going to break EVERY NODE TYPE down with:

What it is

Why it exists

What it does

How elections treat it

When you should use it

When you should NEVER use it

Internal mechanics

By the end of Level 1, your mental model of replica sets will be unbreakable.

🔥 LEVEL 1 — NODE ROLES (BRUTAL, CLEAR, COMPLETE)

There are 6 node types you must understand:

PRIMARY

SECONDARY

ARBITER

HIDDEN

DELAYED

NON-VOTING SECONDARY

We’ll go one-by-one.

1️⃣ PRIMARY NODE

The King. The Leader. The Only Writer.

✔ Definition

PRIMARY = the only node that accepts writes.

Every write operation flows through the primary:

insert

update

delete

multi-document transaction

index creation

schema changes

✔ What it does internally

Write the data to working storage

Append the operation to the oplog

Respond to client

Secondaries replicate from it

✔ Oplog on PRIMARY

PRIMARY generates every oplog entry.

{
  "op": "i",
  "ns": "users",
  "o": { ... }
}

✔ How elections treat it

PRIMARY wins because it has the most recent oplog

When it fails → a secondary takes over

✔ When to use

Always have 1 PRIMARY in your replica set.

✔ When you should NOT have multiple

MongoDB never allows multiple PRIMARYs.
Only ONE.

2️⃣ SECONDARY NODE

The backup node. The replica. The copy machine.

✔ Definition

A SECONDARY is a node that:

Does NOT accept writes

Mirrors data from the PRIMARY

Applies oplog entries

Can become PRIMARY during failover

✔ What it does internally

Connect to primary

Pull oplog entries

Apply operations locally

Stay very close in sync (often < 100ms lag)

✔ Reads on SECONDARY

By default → NO READS
Unless client manually enables:

db.getMongo().setReadPref("secondary")

✔ Why not read by default on secondaries?

Because:

Lag may cause stale reads

Elections complicate read consistency

✔ How elections treat it

Eligible to become PRIMARY

Must have latest oplog

Must have priority > 0

Must have a vote

✔ When to use

For redundancy

For read scaling

For analytics

3️⃣ ARBITER NODE

The “vote-only” node. No data. No storage. No replication.

✔ Definition

A node that:

Does NOT store data

Does NOT replicate

Does NOT have oplog

Only votes in elections

✔ Why arbiters exist

MongoDB elections need majority votes.

If you have:

2 nodes → no majority (2/2 = impossible)
3 nodes → majority possible (2/3)


Instead of paying for 3 servers, you can do:

PRIMARY (data)
SECONDARY (data)
ARBITER (no data, small machine)

✔ How elections treat arbiters

They vote

They cannot become PRIMARY

✔ When to use

ONLY when:

You cannot afford a 3rd data node

Storage cost is high

✔ When to NEVER use

In production where security matters

In clusters with sensitive data

When secondaries are needed for reads

Reason: arbiters can cause data corruption issues if misused.

4️⃣ HIDDEN NODE

The secret secondary. Invisible to clients. Not eligible to become PRIMARY.

✔ Definition

A hidden node:

Stores data

Replicates oplog

Cannot become PRIMARY

Is not visible to client drivers

Cannot accept reads

✔ Why hidden nodes exist

For analytics / backups.

You don’t want clients reading this node.
You don’t want it elected.
You only want a clean copy of data for special tasks.

✔ Use cases

BI tools

Reporting queries

Backup systems

ETL systems

Workloads that would slow down main secondaries

✔ How elections treat hidden nodes

Hidden = priority 0

Never PRIMARY

Can vote or be non-voting

5️⃣ DELAYED NODE

A secondary that runs behind on purpose.

✔ Definition

A secondary configured to lag behind PRIMARY by X seconds/minutes/hours.

Example:

delay = 3600 seconds (1 hour)

✔ Why delayed nodes exist

To protect from logical errors:

Example:

Developer deletes 100k records

PRIMARY + 2 secondaries immediately sync this deletion

ALL nodes lose data

But a delayed node still has old data (1 hour behind)

So you restore from delayed node.

✔ How elections treat delayed nodes

Never PRIMARY

Always priority 0

Only used for disaster recovery

6️⃣ NON-VOTING SECONDARY

A secondary that stores data but doesn’t vote.

✔ Why?

To scale reads WITHOUT affecting elections.

Example:

You want:

PRIMARY
SECONDARY
SECONDARY
SECONDARY (non-voting)
SECONDARY (non-voting)


Votes:

3 voting nodes

2 non-voting nodes

This helps keep elections stable but increase read power.

✔ When to use

Analytics

Read-heavy systems

Distributed clusters

🧠 BIG PICTURE SUMMARY OF NODE ROLES
Node Type	Stores Data	Can Become Primary	Votes	Use Case
PRIMARY	✅	PRIMARY	✅	Main leader
SECONDARY	✅	YES	✅	Replication, failover
ARBITER	❌	❌	✅	Cheap majority vote
HIDDEN	✅	❌	❌ / optional	Analytics, backups
DELAYED	✅	❌	optional	Logical error recovery
NON-VOTING	✅	❌	❌	Read scaling
🔥 MENTAL MODEL (VISUAL)
          PRIMARY
           (leader)
              |
     --------------------
     |        |         |
SECONDARY   SECONDARY   ARBITER
 (failover) (read)     (votes)


More advanced setups add:

HIDDEN → for analytics
DELAYED → for disaster recovery
NON-VOTING → for read scaling

🧠 Now your brain should understand this:

A replica set is NOT just:

“multiple MongoDB nodes”

It is an ecosystem of specialized node types that:

replicate

vote

elect

failover

scale

isolate

protect data

Each node type has a purpose.
Each node behaves differently internally.
Each node matters for availability.