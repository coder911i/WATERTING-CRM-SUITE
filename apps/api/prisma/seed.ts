import { PrismaClient, Plan, TenantStatus, UserRole, ProjectType, ProjectStatus, UnitStatus, LeadSource, PipelineStage, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'waterfront' },
    update: {},
    create: {
      name: 'Waterfront Developers',
      slug: 'waterfront',
      plan: Plan.STARTER,
      status: TenantStatus.ACTIVE,
    },
  });

  console.log(`Created Tenant: ${tenant.name}`);

  // 2. Create Admin User
  // bcrypt hash for 'password123'
  const passwordHash = '$2b$12$LQvPH5M2s6S8uZ7p3JQeEuDq5e5MvOIQ6S8uZ7p3JQeEuDq5e5MvO'; 

  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@waterfront.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@waterfront.com',
      passwordHash,
      name: 'Admin User',
      phone: '+919999999999',
      role: UserRole.ADMIN,
    },
  });

  // Create Sales Agent
  const agent = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'agent@waterfront.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'agent@waterfront.com',
      passwordHash,
      name: 'Sales Agent 1',
      phone: '+918888888888',
      role: UserRole.AGENT,
    },
  });

  console.log(`Created Users: Admin & Agent`);

  // 3. Create Project
  const project = await prisma.project.create({
    data: {
      tenantId: tenant.id,
      name: 'Skyline Heights',
      location: 'Worli, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      projectType: ProjectType.RESIDENTIAL,
      status: ProjectStatus.PLANNING,
      reraNumber: 'P51900012345',
      possessionDate: new Date('2028-12-31'),
      amenities: ['Gym', 'Swimming Pool', 'Clubhouse', 'Yoga Deck'],
    },
  });

  console.log(`Created Project: ${project.name}`);

  // 4. Create Tower
  const tower = await prisma.tower.create({
    data: {
      tenantId: tenant.id,
      projectId: project.id,
      name: 'Tower A',
      totalFloors: 10,
    },
  });

  // 5. Create Units
  for (let floor = 1; floor <= 3; floor++) {
    for (let u = 1; u <= 2; u++) {
      const unitNumber = `${floor}0${u}`;
      const isEven = u % 2 === 0;
      await prisma.unit.create({
        data: {
          tenantId: tenant.id,
          towerId: tower.id,
          unitNumber,
          floor,
          bhkType: isEven ? '3 BHK' : '2 BHK',
          carpetArea: isEven ? 1100 : 750,
          superArea: isEven ? 1500 : 1050,
          facing: isEven ? 'East' : 'West',
          basePrice: isEven ? 15000000 : 10000000,
          totalPrice: isEven ? 16500000 : 11000000,
          status: UnitStatus.AVAILABLE,
        },
      });
    }
  }

  console.log(`Created Units for Tower A`);

  // 6. Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      projectId: project.id,
      assignedToId: agent.id,
      name: 'John Doe',
      phone: '+919876543210',
      email: 'john@example.com',
      budgetMin: 10000000,
      budgetMax: 12000000,
      bhkPreference: ['2 BHK'],
      source: LeadSource.WEBSITE,
      stage: PipelineStage.NEW,
      priority: Priority.MEDIUM,
      notes: 'Interested in mid-floor units.',
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      projectId: project.id,
      assignedToId: admin.id,
      name: 'Jane Smith',
      phone: '+918765432109',
      email: 'jane@example.com',
      budgetMin: 15000000,
      budgetMax: 18000000,
      bhkPreference: ['3 BHK'],
      source: LeadSource.FACEBOOK,
      stage: PipelineStage.INTERESTED,
      priority: Priority.HIGH,
    },
  });

  console.log(`Created Leads: ${lead1.name}, ${lead2.name}`);

  // 7. Create Site Visit
  await prisma.siteVisit.create({
    data: {
      tenantId: tenant.id,
      leadId: lead2.id,
      agentId: admin.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      notes: 'Initial site walkthrough scheduled.',
    },
  });

  // 8. Create Activity
  await prisma.activity.create({
    data: {
      tenantId: tenant.id,
      leadId: lead1.id,
      userId: agent.id,
      type: 'CALL',
      description: 'Attempted call, no answer.',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
