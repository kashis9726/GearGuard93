const { PrismaClient } = require('@prisma/client')

// Ensure DATABASE_URL is set for the seed script
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db"

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Teams
  const teams = [
    { name: 'IT Support', description: 'Computers, Networks, Software' },
    { name: 'Mechanical', description: 'Heavy Machinery, Vehicles' },
    { name: 'Electrical', description: 'Wiring, Power Systems' }
  ]

  const createdTeams = []
  for (const team of teams) {
    const t = await prisma.team.create({ data: team })
    createdTeams.push(t)
    console.log(`Created team: ${t.name}`)
  }

  // Users
  const users = [
    { email: 'admin@gearguard.com', name: 'Admin User', role: 'Admin' },
    { email: 'manager@gearguard.com', name: 'Ops Manager', role: 'Manager' },
    { email: 'tech.it@gearguard.com', name: 'IT Tech', role: 'Technician', teamId: createdTeams[0].id },
    { email: 'tech.mech@gearguard.com', name: 'Mech Tech', role: 'Technician', teamId: createdTeams[1].id },
    { email: 'employee@gearguard.com', name: 'John Doe', role: 'Employee' }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: 'password123' // Dummy password
      }
    })
    console.log(`Created user: ${user.name}`)
  }

  // Equipment
  const equipment = [
    {
      name: 'MacBook Pro M3', serialNumber: 'MBP-2024-001', category: 'Computers', department: 'Design', location: 'Office 301',
      defaultTeamId: createdTeams[0].id
    },
    {
      name: 'CNC Lathe X5', serialNumber: 'CNC-2023-099', category: 'Machinery', department: 'Production', location: 'Factory Floor A',
      defaultTeamId: createdTeams[1].id
    },
    {
      name: 'Main Server Rack', serialNumber: 'SRV-2022-555', category: 'Network', department: 'IT', location: 'Server Room',
      defaultTeamId: createdTeams[0].id
    }
  ]

  for (const eq of equipment) {
    await prisma.equipment.upsert({
      where: { serialNumber: eq.serialNumber },
      update: {},
      create: eq
    })
    console.log(`Created equipment: ${eq.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
