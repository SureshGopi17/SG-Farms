/* SG Farms AI Chatbot Knowledgebase & Matching Engine */

const CHAT_RESPONSES = [
  {
    keywords: ["mango", "mangoes", "banganapalli", "sweet", "fruit"],
    answer: "Our Banganapalli Mangoes are 100% organic and harvested directly from our orchards in Mukkollu. They are grown without toxic artificial ripeners like calcium carbide. Instead, we use straw-bed ripening. You can buy them in our Shop for ₹120/kg!"
  },
  {
    keywords: ["book", "visit", "farm tour", "workshop", "schedule", "experience"],
    answer: "You can book a live farm visit to our fields in Mukkollu! Navigate to the 'Our Field Logs' page and fill out the 'Schedule Farm Visit' booking form. We offer fruit picking, cow-compost workshops, and traditional Andhra meals."
  },
  {
    keywords: ["mukkollu", "location", "where", "village", "address"],
    answer: "SG Farms is located in Mukkollu Village, Krishna District, Andhra Pradesh. We are about 60 km from Vijayawada. Our fields are blessed with black cotton soil and irrigation from the Krishna river canal network."
  },
  {
    keywords: ["panchagavya", "organic", "fertilizer", "manure", "pesticide"],
    answer: "Panchagavya is an organic promoter we brew on-site. It mixes cow dung, cow urine, cow milk, curd, ghee, sugarcane juice, coconut water, and ripe bananas. It boosts plant immunity and soil microflora naturally without chemicals."
  },
  {
    keywords: ["delivery", "area", "shipping", "vijayawada", "ap", "andhra"],
    answer: "We deliver to urban hubs across Andhra Pradesh, including Vijayawada, Guntur, Visakhapatnam, Rajahmundry, Nellore, and Tirupati. Standard delivery takes 24 to 48 hours from harvest time."
  },
  {
    keywords: ["contact", "phone", "email", "support", "farmer", "whatsapp"],
    answer: "You can call us directly at +91 99999 99999, email support@farm.com, or tap the WhatsApp button in the page footer or product page to speak directly to the farmer!"
  },
  {
    keywords: ["rice", "hmt", "grain", "paddy"],
    answer: "Our HMT rice is high-quality, aged for a full year for perfect non-sticky cooking results. It is harvested in October/November from our local delta fields. Available at ₹65/kg."
  },
  {
    keywords: ["price", "cost", "rupees", "payment"],
    answer: "We accept UPI (PhonePe, GooglePay, Paytm), debit cards, and Stripe. You can pay securely during checkout. Mangoes are ₹120/kg, Tomatoes are ₹40/kg, and HMT rice is ₹65/kg."
  }
];

export const ChatbotEngine = {
  getResponse(input) {
    const query = input.toLowerCase().trim();
    
    // Check keyword matches
    for (const item of CHAT_RESPONSES) {
      if (item.keywords.some(keyword => query.includes(keyword))) {
        return item.answer;
      }
    }

    // Default response if no keywords match
    return "I am not sure I fully understand that. You can ask me about 'organic mangoes', 'how to book a farm visit', 'where is Mukkollu', 'Panchagavya fertilizer', or 'delivery locations in Andhra Pradesh'!";
  }
};
