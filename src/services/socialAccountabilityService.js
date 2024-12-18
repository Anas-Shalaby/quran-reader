// src/services/socialAccountabilityService.js
import { db, auth } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  doc,
  updateDoc,
  getDoc,
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

class SocialAccountabilityService {
  // Create a new memorization group
  async createMemorizationGroup(groupDetails) {
    const groupRef = await addDoc(collection(db, 'memorization_groups'), {
      ...groupDetails,
      createdBy: auth.currentUser.uid,
      createdAt: new Date(),
      members: [auth.currentUser.uid],
      memberCount: 1,
      status: 'active'
    });
    return groupRef.id;
  }

  // Join an existing memorization group
  async joinGroup(groupId) {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to join a group');
    }

    const groupRef = doc(db, 'memorization_groups', groupId);
    const groupSnapshot = await getDoc(groupRef);
    
    if (!groupSnapshot.exists()) {
      throw new Error('Group does not exist');
    }

    const groupData = groupSnapshot.data();
    
    // Prevent duplicate joins
    if (groupData.members.includes(auth.currentUser.uid)) {
      return false;
    }

    await updateDoc(groupRef, {
      members: [...groupData.members, auth.currentUser.uid],
      memberCount: groupData.memberCount + 1
    });

    return true;
  }

  // Share progress within a group
  async shareProgress(groupId, progressDetails) {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to share progress');
    }

    const progressRef = await addDoc(collection(db, 'group_progress'), {
      groupId,
      userId: auth.currentUser.uid,
      ...progressDetails,
      sharedAt: new Date()
    });

    return progressRef.id;
  }

  // Fetch group progress
  async getGroupProgress(groupId) {
    const progressQuery = query(
      collection(db, 'group_progress'),
      where('groupId', '==', groupId)
    );

    const progressSnapshot = await getDocs(progressQuery);
    return progressSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Generate group leaderboard
  async getGroupLeaderboard(groupId) {
    const progressQuery = query(
      collection(db, 'group_progress'),
      where('groupId', '==', groupId)
    );

    const progressSnapshot = await getDocs(progressQuery);
    
    // Aggregate progress by user
    const leaderboard = progressSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      if (!acc[data.userId]) {
        acc[data.userId] = {
          totalVerses: 0,
          progressEntries: 0
        };
      }
      
      acc[data.userId].totalVerses += data.completedVerses || 0;
      acc[data.userId].progressEntries++;
      
      return acc;
    }, {});

    // Convert to sorted leaderboard
    return Object.entries(leaderboard)
      .map(([userId, stats]) => ({
        userId,
        averageVersesPerDay: stats.totalVerses / stats.progressEntries,
        totalVerses: stats.totalVerses
      }))
      .sort((a, b) => b.totalVerses - a.totalVerses);
  }

  // Send group invitation
  async sendGroupInvitation(groupId, invitedUserId) {
    const invitationRef = await addDoc(collection(db, 'group_invitations'), {
      groupId,
      invitedBy: auth.currentUser.uid,
      invitedUserId,
      status: 'pending',
      createdAt: new Date()
    });

    return invitationRef.id;
  }

  // Accept group invitation
  async acceptGroupInvitation(invitationId) {
    const invitationRef = doc(db, 'group_invitations', invitationId);
    const invitationSnapshot = await getDoc(invitationRef);
    
    if (!invitationSnapshot.exists()) {
      throw new Error('Invitation not found');
    }

    const invitationData = invitationSnapshot.data();
    
    // Join the group
    await this.joinGroup(invitationData.groupId);

    // Update invitation status
    await updateDoc(invitationRef, {
      status: 'accepted',
      acceptedAt: new Date()
    });

    return true;
  }
}

export default new SocialAccountabilityService();