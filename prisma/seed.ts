
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Clean up existing data
    await prisma.maintenanceRequest.deleteMany()
    await prisma.equipment.deleteMany()

    await prisma.team.deleteMany()
    await prisma.user.deleteMany()

    // Create Teams
    const mechanicalTeam = await prisma.team.create({
        data: {
            name: 'Mechanical Repair',
            description: 'Heavy machinery and hydraulics specialists',
        },
    })

    const electricalTeam = await prisma.team.create({
        data: {
            name: 'Electrical Systems',
            description: 'Circuitry, wiring, and automation controls',
        },
    })

    const itTeam = await prisma.team.create({
        data: {
            name: 'IT Support',
            description: 'Computers, servers, and network equipment',
        },
    })

    // Create Users (Technicians)
    const tech1 = await prisma.user.create({
        data: {
            email: 'alex@gearguard.com',
            name: 'Alex Rivera',
            role: 'Technician',
            password: 'hashed_password_here', // In a real app, hash this
            teamId: mechanicalTeam.id,
        },
    })

    const tech2 = await prisma.user.create({
        data: {
            email: 'sarah@gearguard.com',
            name: 'Sarah Chen',
            role: 'Technician',
            password: 'hashed_password_here',
            teamId: electricalTeam.id,
        },
    })

    const tech3 = await prisma.user.create({
        data: {
            email: 'mike@gearguard.com',
            name: 'Mike Johnson',
            role: 'Technician',
            password: 'hashed_password_here',
            teamId: itTeam.id,
        },
    })

    // Create Equipment
    const conveyor = await prisma.equipment.create({
        data: {
            name: 'Main Conveyor Belt A',
            category: 'Machinery',
            department: 'Production',
            serialNumber: 'MCB-2024-001',
            location: 'Warehouse Zone 1',
            status: 'ACTIVE',
        },
    })

    const generator = await prisma.equipment.create({
        data: {
            name: 'Backup Generator X5',
            category: 'Electrical',
            department: 'Facilities',
            serialNumber: 'GEN-X5-998',
            location: 'Power Plant',
            status: 'MAINTENANCE',
        },
    })

    const server = await prisma.equipment.create({
        data: {
            name: 'Dell PowerEdge R750',
            category: 'IT',
            department: 'IT',
            serialNumber: 'DPE-750-221',
            location: 'Server Room B',
            status: 'ACTIVE',
        },
    })

    const robotArm = await prisma.equipment.create({
        data: {
            name: 'Robotic Arm Kuka KR',
            category: 'Machinery',
            department: 'Production',
            serialNumber: 'KUKA-KR-99',
            location: 'Assembly Line',
            status: 'MAINTENANCE',
        },
    })

    // Create Maintenance Requests
    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Generator Failing to Start',
            description: 'The backup generator cranks but does not turn over. Possible fuel line issue.',
            priority: 'CRITICAL',
            status: 'NEW',
            type: 'CORRECTIVE',
            equipmentId: generator.id,
            teamId: mechanicalTeam.id,
            createdById: tech1.id,
        },
    })

    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Conveyor Belt Squeaking',
            description: 'Loud squeaking noise from the main drive roller.',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            type: 'CORRECTIVE',
            equipmentId: conveyor.id,
            teamId: mechanicalTeam.id,
            assignedToId: tech1.id,
            createdById: tech2.id,
        },
    })

    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Server Overheating',
            description: 'Temperature warning sensors triggered in Server Room B.',
            priority: 'HIGH',
            status: 'NEW',
            type: 'PREVENTIVE',
            equipmentId: server.id,
            teamId: itTeam.id,
            createdById: tech3.id,
        },
    })

    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Robot Arm Calibration',
            description: 'Routine calibration required for the assembly arm.',
            priority: 'LOW',
            status: 'REPAIRED',
            type: 'PREVENTIVE',
            equipmentId: robotArm.id,
            teamId: electricalTeam.id,
            assignedToId: tech2.id,
            createdById: tech1.id,
            completedDate: new Date(),
        },
    })

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
