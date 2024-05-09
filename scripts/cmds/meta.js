const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "meta",
    aliases: ["img5"],
    version: "6.9.0",
    author: "dipto",
    countDown: 15,
    role: 0,
    description: "Photo generate from Meta AI",
    category: "imagination",
    guide: {
      en: "{pn} [prompt]"
    }
  },
  onStart: async function ({ args, event, api }) {
    try {
      const prompt = args.join(" ");
      const wait = await api.sendMessage("𝗪𝗮𝗶𝘁 𝗸𝗼𝗿𝗼 𝗕𝗮𝗯𝘆 <😘", event.threadID);
      const response = await axios.get(`https://noobs-api.onrender.com/dipto/meta?prompt=${encodeURIComponent(prompt)}&key=dipto008`);
      const imgUrls = response.data.imgUrls;
    for (const imgUrl of imgUrls) {
        const imageBuffer = await axios.get(imgUrls, { responseType: 'stream' });
        await api.sendMessage({
          body: `✅ | Generated your image`,
          attachment: imageBuffer.data
        }, event.threadID, event.messageID);
   }
      await api.unsendMessage(wait.messageID);
    } catch (e) {
      console.error(e);
      await api.sendMessage(`Failed to generate photo!!!!\nerror: ${e.message}`, event.threadID);
    }
  }
};
