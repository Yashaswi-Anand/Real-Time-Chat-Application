const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true },
    seen: { type: Boolean, default: false },
  }, 
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;