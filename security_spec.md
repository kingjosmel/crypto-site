# Northstar Supply — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **PII Isolation**: Customer PII (`email`, `phone`, `customerName`, `shippingAddress`, `refundWallet`) is never stored in `/orders/{orderNumber}`. It lives exclusively in `/orderContacts/{contactId}` where `contactId` is a 64-char SHA-256 hex digest and `allow list` is denied to non-admins.
2. **Order Initialization Integrity**: New orders created in `/orders/{orderNumber}` must begin in `paymentStatus == 'awaiting_payment'` and `orderStatus == 'awaiting_payment'`. A caller cannot create an already-paid order (`paid` state shortcutting blocked).
3. **Terminal State & Transition Integrity**: Paid orders (`existing().paymentStatus == 'paid'`) cannot revert to `awaiting_payment` or `confirming`, and immutable fields (`orderNumber`, `emailHash`, `totalCents`, `createdAt`) cannot be altered by non-admins.
4. **Verified Review Integrity**: Reviews in `/reviews/{reviewId}` require an existing `/orders/{orderNumber}` document whose `paymentStatus == 'paid'`. Ratings must be integers `1..5`, `verifiedPurchase == true`, and updates/deletes are restricted to admins.
5. **Admin Isolation**: Verification records (`/verificationRecords/{verificationId}`) are publicly readable for QR lookups but writable only by verified admins (`josmeleph@gmail.com` with `email_verified == true` or `/admins/{uid}`).

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **State Shortcutting on Order Create**: Creating `/orders/NS-00009999` with `paymentStatus: "paid"` and `orderStatus: "confirmed"`.
2. **Shadow Field Injection on Order Create**: Including unexpected `"isAdmin": true` or `"discountOverride": 99999` in `/orders/NS-00009999`.
3. **ID Poisoning on Order Create**: Targeting `/orders/invalid-150-char-poison-id...` that does not match `^NS-[0-9]{8}$`.
4. **Revert Paid Order**: Updating an existing `paid` order back to `paymentStatus: "awaiting_payment"` as a non-admin.
5. **Tamper Order Total**: Updating `totalCents` or `items` on an existing order as a non-admin.
6. **PII Enumeration Attack**: Calling `list` on `/orderContacts` as an unauthenticated user or non-admin.
7. **PII Guessable ID Attack**: Creating `/orderContacts/short_id` with `< 64` hex characters.
8. **Fake Unpaid Review**: Creating `/reviews/NS-00000002_prod1` when `/orders/NS-00000002` has `paymentStatus: "awaiting_payment"`.
9. **Orphan Review**: Creating `/reviews/NS-99999999_prod1` when `/orders/NS-99999999` does not exist.
10. **Rating Out-of-Bounds**: Creating a review with `rating: 99` or `verifiedPurchase: false`.
11. **Non-Admin Verification Forgery**: Creating or updating `/verificationRecords/NS-2026-001` as an unauthenticated user or unverified email.
12. **Catch-All Write**: Writing to an undeclared collection `/systemSecrets/key1`.
