#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:8000/api}"

fail() {
  echo "FAILED: $*" >&2
  exit 1
}

assert_json_success() {
  local name="$1"
  local url="$2"

  echo "==> $name"
  echo "GET $url"

  # -f: fail on non-2xx, -sS: silent but show errors
  local body
  body="$(curl -f -sS -H "Accept: application/json" "$url")" || fail "request error for $name"

  # crude-but-effective check without jq dependency
  echo "$body" | grep -q '"success"[[:space:]]*:[[:space:]]*true' || {
    echo "$body" >&2
    fail "success!=true for $name"
  }

  echo "OK"
  echo
}

echo "Backend smoke tests"
echo "API_BASE = $API_BASE"
echo

assert_json_success "classes" "$API_BASE/classes.php"
assert_json_success "sessions" "$API_BASE/sessions.php"
assert_json_success "membership_plans" "$API_BASE/membership_plans.php"

echo "All smoke tests passed."

