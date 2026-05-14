#!/usr/bin/env bash
# End-to-end smoke test: hit every endpoint, assert Node-compatible response shape.
# Run AFTER `uvicorn app.main:app` is up on port 5000.
set -euo pipefail

BASE="${BASE:-http://localhost:5001}"
PHONE="${PHONE:-9876543210}"

say() { printf "\n\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
fail(){ printf "  \033[1;31m✗ %s\033[0m\n" "$*"; exit 1; }

say "1/9  GET /api/health"
curl -sS "$BASE/api/health" | tee /tmp/pb_health.json
grep -q '"status":"OK"' /tmp/pb_health.json && ok health || fail health

say "2/9  POST /api/auth/send-otp"
curl -sS -X POST "$BASE/api/auth/send-otp" \
  -H 'Content-Type: application/json' \
  -d "{\"phone\":\"$PHONE\"}" | tee /tmp/pb_otp.json
OTP=$(python3 -c 'import json,sys; print(json.load(open("/tmp/pb_otp.json"))["demo_otp"])')
[ -n "$OTP" ] && ok "got OTP $OTP" || fail "no OTP in response"

say "3/9  POST /api/auth/verify-otp"
curl -sS -X POST "$BASE/api/auth/verify-otp" \
  -H 'Content-Type: application/json' \
  -d "{\"phone\":\"$PHONE\",\"otp\":\"$OTP\"}" | tee /tmp/pb_login.json
TOKEN=$(python3 -c 'import json; print(json.load(open("/tmp/pb_login.json"))["token"])')
USER_ID=$(python3 -c 'import json; print(json.load(open("/tmp/pb_login.json"))["user"]["_id"])')
[ -n "$TOKEN" ] && ok "got JWT" || fail "no token"
[ -n "$USER_ID" ] && ok "user _id is $USER_ID" || fail "no _id in user"

say "4/9  PUT /api/auth/profile"
curl -sS -X PUT "$BASE/api/auth/profile" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test User","location":"Pune"}' | tee /tmp/pb_profile.json
grep -q '"name":"Test User"' /tmp/pb_profile.json && ok profile || fail profile

say "5/9  POST /api/animals (multipart, no images)"
curl -sS -X POST "$BASE/api/animals" \
  -H "Authorization: Bearer $TOKEN" \
  -F type=cow -F price=52000 -F age=3 -F ageUnit=years \
  -F location=Pune -F breed=jersey -F milkPerDay=12 \
  -F description='Healthy Jersey, second calving' | tee /tmp/pb_create.json
ANIMAL_ID=$(python3 -c 'import json; print(json.load(open("/tmp/pb_create.json"))["_id"])')
[ -n "$ANIMAL_ID" ] && ok "created $ANIMAL_ID" || fail create

say "6/9  GET /api/animals (list)"
curl -sS "$BASE/api/animals?type=cow&limit=5" | tee /tmp/pb_list.json
TOTAL=$(python3 -c 'import json; print(json.load(open("/tmp/pb_list.json"))["total"])')
[ "$TOTAL" -ge 1 ] && ok "list returned $TOTAL" || fail list

say "7/9  GET /api/animals/:id"
curl -sS "$BASE/api/animals/$ANIMAL_ID" | tee /tmp/pb_one.json
grep -q "\"_id\":\"$ANIMAL_ID\"" /tmp/pb_one.json && ok single || fail single

say "8/9  GET /api/animals/my/listings"
curl -sS "$BASE/api/animals/my/listings" -H "Authorization: Bearer $TOKEN" | tee /tmp/pb_my.json
grep -q "\"_id\":\"$ANIMAL_ID\"" /tmp/pb_my.json && ok my-listings || fail my-listings

say "9/9  DELETE /api/animals/:id"
curl -sS -X DELETE "$BASE/api/animals/$ANIMAL_ID" \
  -H "Authorization: Bearer $TOKEN" | tee /tmp/pb_del.json
grep -q '"message":"Listing removed"' /tmp/pb_del.json && ok delete || fail delete

say "All 9 endpoints passed. Backend is wire-compatible with the Node API."
