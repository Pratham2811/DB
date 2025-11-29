How primary writes

How oplog entries are constructed

How secondaries pull data

How replication pipelining works

Why lag happens

What timestamps matter

How sync sources are chosen

How rollback works

How elections depend on oplog similarity

How MongoDB guarantees consistency

This is deep backend + database internals — exactly your style.

Let’s go step-by-step, real, brutal, internal.

🔥 LEVEL 2 — THE REPLICATION ENGINE (INSIDE MONGODB)

MongoDB replication has 6 stages:

Write on PRIMARY

PRIMARY creates oplog entry

SECONDARY tails (streams) the oplog

Apply replication pipeline

SECONDARY commits updates

SECONDARY acknowledges replication (WriteConcern)

We will go through each one.

1️⃣ STAGE 1 — WRITE HAPPENS ON PRIMARY (THE STARTING POINT)

Client sends:

insertOne({name:"Prathamesh"})


PRIMARY does 2 things:

✔ 1. Writes data to the WiredTiger storage engine

Document stored in data files

Indexes updated

Checkpoints used for durability

✔ 2. Logs the operation to the OPLOG

This is the single most important thing:

Every write = 1 oplog entry.

PRIMARY is the single source of truth for :

data

oplog stream

cluster time

2️⃣ STAGE 2 — PRIMARY CREATES OPLOG ENTRY (THE HEART OF REPLICATION)

Oplog = Operation Log
Location:

local.oplog.rs


It’s a capped collection (fixed size, circular buffer).

Example oplog entry:

{
  "ts": Timestamp(1728392020, 1),
  "t": 5,
  "h": NumberLong("930492309402"),
  "v": 2,
  "op": "i",
  "ns": "StorageApp.users",
  "o": { "_id": ObjectId("..."), "name": "Prathamesh" }
}


Let’s break this down:

✔ ts – logical timestamp

This is how secondaries know ordering.

✔ t – term

The term from the current primary’s election round.

✔ op – operation type

i = insert

u = update

d = delete

c = command (index creation, etc.)

n = no-op (used for heartbeats)

✔ ns – namespace (db.collection)

Ex: "StorageApp.users"

✔ o – the actual operation content

The content inserted/updated/deleted.

3️⃣ STAGE 3 — SECONDARIES TAIL THE OPLOG (STREAMING)

SECONDARY connects to PRIMARY and starts a replication thread.

Internally, SECONDARY runs:

Find latest timestamp I have  
Request all ops after that timestamp  
Keep reading like a log tail


This is almost identical to:

tail -f oplog


SECONDARY continuously requests:

Give me the next operation after ts = X


PRIMARY returns a batch of oplog entries.

IMPORTANT:

Secondaries do not copy the whole database again and again.

They only replay oplog events.

4️⃣ STAGE 4 — REPLICATION PIPELINE (3 INTERNAL THREADS)

MongoDB secondaries run a 3-thread replication engine:

[Fetch Stage] → [Buffer Stage] → [Apply Stage]


Let’s break these.

🧵 A. FETCH STAGE (oplog fetcher)

This thread pulls oplog entries from PRIMARY.

Connects to primary's oplog

Reads new entries

Streams them down

If PRIMARY is slow → fetcher slows.
If network is slow → fetcher slows (lag starts here).

🧵 B. BUFFER STAGE (oplog buffer)

Fetched oplog entries are placed into an internal in-memory queue.

It’s like a message queue:

New oplog events go in

Applier thread consumes them

If:

Apply thread slow → buffer fills up

Buffer fills too much → replication lag grows

Buffer full → SECONDARY falls out of sync

🧵 C. APPLY STAGE (oplog applier)

This is where SECONDARY replays the operations.

For each oplog entry:

insert → insert

update → update

delete → delete

Exactly the same operation PRIMARY did.

MongoDB guarantees:

Same order

Same timestamps

Same commit semantics

WHY THIS PIPELINE IS SEPARATE?

Because:

Fetching oplog is I/O bound

Applying oplog is CPU + disk bound

Buffering solves mismatch between the two speeds

This design maximizes replication speed.

5️⃣ STAGE 5 — SECONDARY COMMITS UPDATES

After applying operations, the SECONDARY:

Updates its own data files

Updates its oplog timestamp

Updates majority commit point

Replies to PRIMARY about replication status

Now it is in sync.

6️⃣ STAGE 6 — WRITE CONCERN (ACKING REPLICATION)

When a client writes with:

{ writeConcern: { w: "majority" } }


Flow is:

PRIMARY writes

PRIMARY logs oplog

SECONDARY applies oplog

SECONDARY confirms

PRIMARY returns success to client

This ensures no data loss even during failover.

🧠 INTERNAL BEHAVIOR OF SECONDARY

SECONDARY tracks:

Last fetched timestamp

Last applied timestamp

Oplog sync source

Replication lag

Heartbeats from PRIMARY

SECONDARY may switch sync source if:

Primary slow

Network slow

Another secondary faster

This is automatic.

⚠️ WHAT IS REPLICATION LAG?

Difference between:

primary.oplog_latest_timestamp
vs
secondary.applied_latest_timestamp


Lag reasons:

Secondary disk slow

Primary very busy

Network poor

Secondary CPU overloaded

Large operations (bulk update/delete)

Lag is visible via:

rs.printSlaveReplicationInfo()

🧠 FAILOVER + OPLOG + ELECTION RELATIONSHIP

This is crucial:

✔ Winner of election = node with the most recent oplog

MongoDB checks:

“Who has latest operations?”

“Who is least behind?”

If a node falls behind:

It CANNOT become primary

Even if its priority is high

Oplog freshness = leadership eligibility.

❤️ WHY OPLOG MAKES FAILOVER SAFE

Imagine PRIMARY dies.

Your cluster has:

PRIMARY
SECONDARY 1 (latest)
SECONDARY 2 (lagging)


Election algorithm chooses:

SECONDARY 1

because:

Largest oplog timestamp

Closest to data consistency

Safe to promote

SECONDARY 2 cannot win:

It will cause potential data loss

MongoDB prevents this

It votes NO for itself

This maintains strong data consistency.

⚠️ WHAT IF SECONDARY FALLS TOO FAR BEHIND?

If SECONDARY’s oplog becomes too old, and the PRIMARY rotated out old oplog entries:

SECONDARY cannot catch up.

Then SECONDARY enters:

❌ RECOVERING state
❌ Must perform initial sync again
❌ Copies entire DB from primary again

This is expensive, so good setups keep:

Big oplog size

Healthy hardware

Low replication lag

🔥 LEVEL 2 SUMMARY (THE REAL ENGINE)

Here is your complete Level 2 mental model:

CLIENT WRITE  
   ↓
PRIMARY  
   ↓ writes to data  
   ↓ writes to oplog  
SECONDARY  
   ↓ fetch oplog  
   ↓ buffer oplog  
   ↓ apply oplog  
   ↓ commit  
   ↓ send ack  


If PRIMARY fails:

Election chooses the secondary with latest oplog

That secondary becomes PRIMARY

Replication continues

Zero downtime

Oplog = the heartbeat of replication.
Everything depends on it.