service cloud.firestore {
  match /databases/{database}/documents {

    // ✅ Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // ✅ Teams collection
    match /teams/{teamId} {
      allow read, write, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow read, write, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // ✅ Tournaments collection
    match /tournaments/{tourneyId} {
      allow read: if request.auth != null;
      allow write, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // ✅ Games Weekly
    match /games_weekly/{gameId} {
      allow read: if request.auth != null;
      allow write, update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // ✅ Games Daily
    match /games_daily/{gameId} {
      allow read: if request.auth != null;
      allow write, update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // ❌ Default Deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
      }
