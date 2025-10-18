import mongoose from 'mongoose';

const CultivationSchema = new mongoose.Schema({
  realm: { type: String, default: 'Mortal' },
  stage: { type: Number, default: 1 },
  qi: { type: Number, default: 0 },
  maxQi: { type: Number, default: 100 },
  speed: { type: Number, default: 1 }
});

const StatsSchema = new mongoose.Schema({
  strength: { type: Number, default: 10 },
  agility: { type: Number, default: 10 },
  intelligence: { type: Number, default: 10 },
  vitality: { type: Number, default: 10 }
});

const InventoryItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  quantity: { type: Number, default: 1 }
});

const GameSaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  player: {
    name: { type: String, default: 'Cultivator' },
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    cultivation: CultivationSchema,
    stats: StatsSchema,
    inventory: [InventoryItemSchema],
    techniques: [String],
    location: { type: String, default: 'starting-village' },
    gold: { type: Number, default: 100 }
  },
  world: {
    currentTime: { type: Number, default: 0 },
    discoveredLocations: [{ type: String }],
    activeQuests: [{ type: String }]
  },
  lastSaved: {
    type: Date,
    default: Date.now
  },
  playTime: {
    type: Number,
    default: 0
  }
});

// Update lastSaved timestamp before saving
GameSaveSchema.pre('save', function(next) {
  this.lastSaved = new Date();
  next();
});

export default mongoose.models.GameSave || mongoose.model('GameSave', GameSaveSchema);