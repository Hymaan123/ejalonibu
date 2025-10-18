// Mock database for development without native dependencies
// This is a simple in-memory data store for demonstration

class MockDatabase {
  constructor() {
    this.data = {
      users: [],
      projects: [],
      enquiries: [],
      quotes: [],
      services: []
    };
    this.connected = false;
  }

  async authenticate() {
    this.connected = true;
    console.log('Mock database connected successfully');
    return Promise.resolve();
  }

  async sync(options = {}) {
    console.log('Mock database models synchronized');
    return Promise.resolve();
  }

  // Mock query method for compatibility
  async query(sql, options = {}) {
    console.log('Mock query executed:', sql);
    return Promise.resolve([]);
  }
}

// Create a mock sequelize-like object
const mockSequelize = new MockDatabase();

// Add some compatibility methods
mockSequelize.define = (name, attributes, options = {}) => {
  console.log(`Mock model '${name}' defined`);
  return {
    findAll: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findByPk: () => Promise.resolve(null),
    create: (data) => Promise.resolve({ id: 1, ...data }),
    update: () => Promise.resolve([1]),
    destroy: () => Promise.resolve(1),
    associate: () => {}
  };
};

module.exports = mockSequelize;