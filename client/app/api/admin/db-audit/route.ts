/**
 * TEMPORARY DIAGNOSTIC ENDPOINT — remove after audit is complete
 * GET /api/admin/db-audit
 *
 * Connects to MongoDB, samples 3 documents from every collection, and
 * returns a JSON report comparing real document keys against the expected
 * schema keys defined below.
 */
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Expected top-level keys for each collection (derived from Mongoose schemas)
const EXPECTED_KEYS: Record<string, string[]> = {
  applications: ['firstName', 'lastName', 'email', 'phone', 'education', 'studyPreference', 'status', 'createdAt', 'updatedAt'],
  universitycities: ['id', 'cityName', 'slug', 'region', 'country', 'latitude', 'longitude', 'heroImage', 'monthlyEstimateEUR', 'currencySymbol', 'overallScore', 'safetyScore', 'studentFriendliness', 'universityNames', 'metrics', 'nomadListStyleTags', 'internetSpeedMbps', 'dataSourceNotes', 'cityDescription', 'housingLink', 'createdAt', 'updatedAt'],
  clerkuserraws: ['clerkId', 'firstName', 'lastName', 'username', 'imageUrl', 'profileImageUrl', 'gender', 'birthday', 'passwordEnabled', 'twoFactorEnabled', 'primaryEmailAddressId', 'primaryPhoneNumberId', 'primaryWeb3WalletId', 'externalId', 'emailAddresses', 'phoneNumbers', 'web3Wallets', 'externalAccounts', 'publicMetadata', 'privateMetadata', 'unsafeMetadata', 'clerkCreatedAt', 'clerkUpdatedAt', 'lastSignInAt', 'primaryEmailAddress', 'primaryPhoneNumber', 'createdAt', 'updatedAt'],
  comments: ['authorId', 'postId', 'content', 'originalAuthorFullName', 'originalAuthorAvatarUrl', 'originalAuthorExternalId', 'createdAt', 'updatedAt'],
  communities: ['type', 'name', 'slug', 'description', 'imageUrl', 'city', 'country', 'postCount', 'memberCount', 'createdAt', 'updatedAt'],
  conversations: ['participants', 'participantDetails', 'lastMessage', 'createdAt', 'updatedAt'],
  courses: ['nome', 'link', 'tipo', 'uni', 'uniSlug', 'accesso', 'area', 'lingua', 'comune', 'deadlines', 'academicYear', 'intake', 'viewCount', 'favoriteCount', 'trackedCount', 'createdAt', 'updatedAt'],
  favorites: ['userId', 'courseId', 'courseUni', 'courseNome', 'courseLink', 'courseComune', 'createdAt', 'updatedAt'],
  generatedposts: ['slug', 'lang', 'content', 'frontmatter', 'createdAt', 'updatedAt'],
  leads: ['name', 'email', 'whatsapp', 'country', 'quiz_answers', 'tag', 'created_at', 'contacted_at', 'converted'],
  memberships: ['userId', 'communityId', 'joinedAt'],
  messages: ['conversationId', 'senderId', 'senderFullName', 'senderAvatarUrl', 'senderRole', 'content', 'readBy', 'createdAt'],
  posts: ['authorId', 'communityId', 'communityType', 'communityName', 'communitySlug', 'content', 'category', 'originalAuthorFullName', 'originalAuthorAvatarUrl', 'originalAuthorExternalId', 'isClaimable', 'originalUserCountry', 'commentsCount', 'likesCount', 'bookmarksCount', 'likedBy', 'bookmarkedBy', 'createdAt', 'updatedAt'],
  trackeditems: ['userId', 'courseId', 'userApplicationStatus', 'userNotes', 'isArchived', 'courseLink', 'createdAt', 'updatedAt'],
  universities: ['name', 'slug', 'location', 'city', 'description', 'logoUrl', 'websiteUrl', 'contacts', 'deadline', 'admission_fee', 'cgpa_requirement', 'english_requirement', 'intakes', 'application_link', 'viewCount', 'favoriteCount', 'trackedCount', 'id', 'createdAt', 'updatedAt'],
  universitycommunitypost: ['universitySlug', 'userId', 'userFullName', 'userAvatarUrl', 'userRole', 'postType', 'content', 'tags', 'isArchived', 'comments', 'housingDetails', 'studyGroupDetails', 'likedBy', 'bookmarkedBy', 'originalFacebookUsername', 'originalFacebookUserAvatarUrl', 'facebookUserId', 'isClaimable', 'claimedByUserId', 'originalUserCountry', 'postedByAdminId', 'createdAt', 'updatedAt'],
  universityfavorites: ['userId', 'universityId', 'createdAt', 'updatedAt'],
  universitytrackeditems: ['userId', 'universityId', 'createdAt', 'updatedAt'],
  users: ['clerkId', 'email', 'xp', 'level', 'streak', 'lastLogin', 'tier', 'shortlist', 'unlockedFeatures', 'stripeCustomerId', 'subscriptionId', 'subscriptionStatus', 'preferredLanguage', 'isOnboardingComplete', 'lastActiveDate', 'profileDetail', 'createdAt', 'updatedAt'],
  userprofiledetails: ['userId', 'personalData', 'educationalData', 'role', 'premiumTier', 'workExperience', 'languages', 'profileVisibility', 'languageInterests', 'targetUniversities', 'aboutMe', 'interest', 'userType', 'graduationYear', 'fieldOfInterest', 'studyAbroadStage', 'createdAt', 'updatedAt'],
};

function getDocKeys(docs: Record<string, unknown>[]): string[] {
  const keys = new Set<string>();
  for (const doc of docs) {
    for (const k of Object.keys(doc)) keys.add(k);
  }
  return [...keys].sort();
}

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return NextResponse.json({ error: 'MONGODB_URI not set' }, { status: 500 });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const allCollections = (await db.listCollections().toArray()).map(c => c.name).sort();
    const report: Record<string, unknown> = { allCollections, models: {} };

    for (const [collection, expectedKeys] of Object.entries(EXPECTED_KEYS)) {
      const col = db.collection(collection);
      const count = await col.countDocuments();
      const samples = await col.find({}).limit(3).toArray() as Record<string, unknown>[];
      const indexes = await col.indexes();

      const realKeys = getDocKeys(samples);
      const missingInSchema = realKeys.filter(k => k !== '_id' && k !== '__v' && !expectedKeys.includes(k));
      const notInData = expectedKeys.filter(k => !realKeys.includes(k));

      // Detect duplicate indexes
      const indexKeys = indexes.map(i => JSON.stringify(i.key));
      const dupIndexes = indexKeys.filter((k, i) => indexKeys.indexOf(k) !== i);

      (report.models as Record<string, unknown>)[collection] = {
        documentCount: count,
        empty: count === 0,
        realKeys,
        extraKeysInData: missingInSchema,      // in real docs but NOT in schema
        missingKeysInData: notInData,           // in schema but absent from all 3 samples
        indexes: indexes.map(i => ({ key: i.key, unique: !!i.unique, name: i.name })),
        duplicateIndexKeys: dupIndexes,
        sampleDoc: samples[0] ?? null,
      };
    }

    return NextResponse.json(report, { status: 200 });
  } finally {
    await client.close();
  }
}
