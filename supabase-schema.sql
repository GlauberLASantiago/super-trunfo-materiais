-- ============================================================
-- Super Trunfo: Engenharia de Materiais — Supabase Schema
-- ============================================================
-- Execute these statements in your Supabase SQL Editor
-- (Database → SQL Editor → New query → paste → Run)
--
-- NOTE: Table names contain hyphens, so they must always be
-- wrapped in double-quotes in raw SQL.
-- The JS client (.from('super-trunfo-profiles')) handles this
-- automatically — no quoting needed in JavaScript.
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. PROFILES
--    One row per authenticated user; stores the chosen nickname.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "super-trunfo-profiles" (
    id         UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    nickname   TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "super-trunfo-profiles" ENABLE ROW LEVEL SECURITY;

-- Anyone logged-in can read all profiles (needed for lobby nicknames)
CREATE POLICY "profiles_select"
    ON "super-trunfo-profiles" FOR SELECT
    TO authenticated
    USING (TRUE);

-- Users may only insert their own profile row
CREATE POLICY "profiles_insert"
    ON "super-trunfo-profiles" FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Users may only update their own profile row
CREATE POLICY "profiles_update"
    ON "super-trunfo-profiles" FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);


-- ──────────────────────────────────────────────────────────────
-- 2. GAME ROOMS
--    One row per active or finished match.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "super-trunfo-game-rooms" (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Participants
    player1_id         UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
    player2_id         UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
    player1_nickname   TEXT,
    player2_nickname   TEXT,

    -- Room lifecycle: waiting | playing | finished
    status             TEXT        NOT NULL DEFAULT 'waiting',

    -- Each player's hand (array of card objects)
    player1_deck       JSONB       NOT NULL DEFAULT '[]',
    player2_deck       JSONB       NOT NULL DEFAULT '[]',
    tied_cards         JSONB       NOT NULL DEFAULT '[]',

    -- Turn & phase tracking
    current_turn       UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
    game_phase         TEXT        NOT NULL DEFAULT 'playing',
    -- game_phase values: playing | resolving | result | gameover

    -- Round result
    selected_stat      TEXT,
    round_winner       TEXT,
    -- round_winner values: player1 | player2 | draw | NULL

    -- Game result
    winner_id          UUID        REFERENCES auth.users (id) ON DELETE SET NULL,

    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "super-trunfo-game-rooms" ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can browse rooms (needed for lobby list)
CREATE POLICY "rooms_select"
    ON "super-trunfo-game-rooms" FOR SELECT
    TO authenticated
    USING (TRUE);

-- Only the user who is player1 may create a room
CREATE POLICY "rooms_insert"
    ON "super-trunfo-game-rooms" FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = player1_id);

-- Only the two players involved may update their room
CREATE POLICY "rooms_update"
    ON "super-trunfo-game-rooms" FOR UPDATE
    TO authenticated
    USING (auth.uid() = player1_id OR auth.uid() = player2_id);


-- ──────────────────────────────────────────────────────────────
-- 3. REALTIME
--    Enable Postgres Changes on the game-rooms table so that the
--    JS client receives live updates via Supabase Realtime.
-- ──────────────────────────────────────────────────────────────
-- In the Supabase Dashboard go to:
--   Database → Replication → Tables
-- and enable replication for "super-trunfo-game-rooms".
--
-- Alternatively, run the statement below (requires superuser):
-- ALTER PUBLICATION supabase_realtime ADD TABLE "super-trunfo-game-rooms";


-- ──────────────────────────────────────────────────────────────
-- 4. GOOGLE OAUTH SETUP (Dashboard — no SQL needed)
-- ──────────────────────────────────────────────────────────────
-- 1. Go to Authentication → Providers → Google and enable it.
-- 2. Add your Google OAuth Client ID and Secret
--    (create credentials at console.cloud.google.com).
-- 3. Add your site URL to Authentication → URL Configuration:
--      Site URL:          https://your-site.com
--      Redirect URLs:     https://your-site.com
-- 4. In index.html replace the two placeholder values:
--      const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
--      const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
--    with your project's URL and anon key from
--    Project Settings → API.
