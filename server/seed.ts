import { db } from './db';
import { users, elections, candidates } from '@shared/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.delete(candidates);
  await db.delete(elections);
  await db.delete(users);

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const [admin] = await db.insert(users).values({
    username: 'admin',
    password: passwordHash,
    name: 'Admin User',
    role: 'admin',
    voterId: null,
    securityToken: '123456',
    isActive: true,
    createdAt: new Date(),
    faceData: null,
    lastLogin: null
  }).returning();

  console.log('✓ Created admin user');

  // Create voter user
  const voterPasswordHash = await bcrypt.hash('password123', 10);
  const [voter] = await db.insert(users).values({
    username: 'voter1',
    password: voterPasswordHash,
    name: 'Jane Cooper',
    role: 'voter',
    voterId: 'VOT-789456',
    securityToken: null,
    isActive: true,
    createdAt: new Date(),
    faceData: null,
    lastLogin: null
  }).returning();

  console.log('✓ Created voter user');

  // Create election
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + 7);

  const [election] = await db.insert(elections).values({
    title: 'General Election 2025',
    description: 'Presidential and vice-presidential election',
    startDate: now,
    endDate: endDate,
    isActive: true
  }).returning();

  console.log('✓ Created election');

  // Create candidates
  const candidatesData = [
    { name: 'John Smith', party: 'Democratic', position: 'President', electionId: election.id },
    { name: 'Sarah Johnson', party: 'Republican', position: 'President', electionId: election.id },
    { name: 'Robert Wilson', party: 'Independent', position: 'President', electionId: election.id },
    { name: 'Michael Brown', party: 'Democratic', position: 'Vice President', electionId: election.id },
    { name: 'Jennifer Garcia', party: 'Republican', position: 'Vice President', electionId: election.id },
    { name: 'Elizabeth Taylor', party: 'Independent', position: 'Vice President', electionId: election.id },
  ];

  await db.insert(candidates).values(candidatesData);
  console.log('✓ Created candidates');

  console.log('✅ Seeding complete!');
}

seed()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });