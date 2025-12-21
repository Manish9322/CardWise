
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowUserRegistrations: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure there is only one settings document
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};


const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
