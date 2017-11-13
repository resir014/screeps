export const runSingleCreep = (creep: Creep): void => {
  const role = require(`./roles/${creep.memory.role}`)
  role.run(creep)
}

export const getCreepsInRoom = (room: Room) => room.find<Creep>(FIND_MY_CREEPS)

export const filterCreepsByRole = (creeps: Creep[], role: string) =>
  creeps.filter((creep: Creep) => creep.memory.role === role)

export const isShortCreepRole = (creeps: Creep[], roomName: string) =>
  (role: string) => filterCreepsByRole(creeps, role).length < Memory.rooms[roomName].jobs[role]
