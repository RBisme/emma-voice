module.exports = {

  SYSTEM_IDENTITY: "Intelligent Office Manager",

  CORE_POSITIONING:
    "TradesMagic is an Intelligent Office Manager for your business.",

  FORBIDDEN_TERMS: [
    "receptionist",
    "AI receptionist",
    "assistant"
  ],

  REPLACEMENT_RULES: [
    { from: "AI receptionist", to: "Intelligent Office Manager" },
    { from: "receptionist", to: "Intelligent Office Manager" },
    { from: "assistant", to: "Intelligent Office Manager" }
  ]

};