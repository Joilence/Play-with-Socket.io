class RoomManager {
    init() {
        this.roomPool = {};
    }

    addUserTo(info) {
        if (!roompool[info.roomId]) {
            roomPool[info.roomId] = [];
        } else {
            roomPool[info.roomId].push(info.userId)
        }
    }
}

export default new RoomManager();